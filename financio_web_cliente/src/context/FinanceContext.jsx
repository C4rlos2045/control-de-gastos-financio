import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react';

import { useAuth } from './AuthContext';

import { categoriasApi } from '../services/categoriasApi';
import { movimientosApi } from '../services/movimientosApi';
import { reportesApi } from '../services/reportesApi';

const FinanceContext = createContext();

const convertirFechaAApi = (fecha) => {
  if (!fecha) return '';

  const formatoApi = /^\d{4}-\d{2}-\d{2}$/;
  const formatoVisual = /^\d{2}\/\d{2}\/\d{4}$/;

  if (formatoApi.test(fecha)) {
    return fecha;
  }

  if (formatoVisual.test(fecha)) {
    const [dia, mes, anio] = fecha.split('/');
    return `${anio}-${mes}-${dia}`;
  }

  return fecha;
};

const convertirFechaVisual = (fecha) => {
  if (!fecha) return '';

  const formatoApi = /^\d{4}-\d{2}-\d{2}$/;

  if (!formatoApi.test(fecha)) {
    return fecha;
  }

  const [anio, mes, dia] = fecha.split('-');

  return `${dia}/${mes}/${anio}`;
};

const normalizarCategoria = (categoria) => {
  return {
    id: categoria.id,
    usuario_id: categoria.usuario_id,
    nombre: categoria.nombre,
    tipo: categoria.tipo,
    es_global: categoria.es_global,
    creado_en: categoria.creado_en,
    actualizado_en: categoria.actualizado_en
  };
};

const normalizarMovimiento = (movimiento) => {
  return {
    id: movimiento.id,
    usuario_id: movimiento.usuario_id,
    categoria_id: movimiento.categoria_id,

    tipo: movimiento.tipo,
    descripcion: movimiento.descripcion,
    monto: Number(movimiento.monto),
    fecha: convertirFechaVisual(movimiento.fecha),

    categoria:
      movimiento.categorias?.nombre ||
      movimiento.categoria ||
      'Sin categoría',

    categoriaDetalle: movimiento.categorias || null,

    creado_en: movimiento.creado_en,
    actualizado_en: movimiento.actualizado_en
  };
};

export function FinanceProvider({ children }) {
  const { usuario } = useAuth();

  const [movimientos, setMovimientos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [resumen, setResumen] = useState(null);
  const [gastosPorCategoria, setGastosPorCategoria] = useState([]);
  const [movimientosPorMes, setMovimientosPorMes] = useState([]);

  const [cargandoFinanzas, setCargandoFinanzas] = useState(false);
  const [errorFinanzas, setErrorFinanzas] = useState('');

  const categoriasGasto = useMemo(
    () =>
      categorias.filter(
        (categoria) => categoria.tipo === 'gasto'
      ),
    [categorias]
  );

  const categoriasIngreso = useMemo(
    () =>
      categorias.filter(
        (categoria) => categoria.tipo === 'ingreso'
      ),
    [categorias]
  );

  const buscarCategoriaId = useCallback(
    (tipo, nombreCategoria) => {
      const categoriaEncontrada = categorias.find(
        (categoria) =>
          categoria.tipo === tipo &&
          categoria.nombre === nombreCategoria
      );

      return categoriaEncontrada?.id || null;
    },
    [categorias]
  );

  const cargarCategorias = useCallback(async (filtros = {}) => {
    const data = await categoriasApi.listar(filtros);

    const categoriasNormalizadas =
      data.categorias.map(normalizarCategoria);

    setCategorias(categoriasNormalizadas);

    return categoriasNormalizadas;
  }, []);

  const cargarMovimientos = useCallback(async (filtros = {}) => {
    const data = await movimientosApi.listar(filtros);

    const movimientosNormalizados =
      data.movimientos.map(normalizarMovimiento);

    setMovimientos(movimientosNormalizados);

    return movimientosNormalizados;
  }, []);

  const cargarReportes = useCallback(async (filtros = {}) => {
    const [
      dataResumen,
      dataGastosCategoria,
      dataMovimientosMes
    ] = await Promise.all([
      reportesApi.resumen(filtros),
      reportesApi.gastosPorCategoria(filtros),
      reportesApi.movimientosPorMes(filtros)
    ]);

    setResumen(dataResumen.resumen);
    setGastosPorCategoria(
      dataGastosCategoria.reporte.categorias || []
    );
    setMovimientosPorMes(
      dataMovimientosMes.reporte || []
    );

    return {
      resumen: dataResumen.resumen,
      gastosPorCategoria:
        dataGastosCategoria.reporte.categorias || [],
      movimientosPorMes:
        dataMovimientosMes.reporte || []
    };
  }, []);

  const cargarDatosFinancieros = useCallback(
    async (filtros = {}) => {
      if (!usuario) return;

      try {
        setCargandoFinanzas(true);
        setErrorFinanzas('');

        await cargarCategorias();
        await cargarMovimientos(filtros);
        await cargarReportes(filtros);
      } catch (error) {
        setErrorFinanzas(error.message);
      } finally {
        setCargandoFinanzas(false);
      }
    },
    [
      usuario,
      cargarCategorias,
      cargarMovimientos,
      cargarReportes
    ]
  );

  useEffect(() => {
    if (!usuario) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMovimientos([]);
      setCategorias([]);
      setResumen(null);
      setGastosPorCategoria([]);
      setMovimientosPorMes([]);
      setErrorFinanzas('');
      return;
    }

    cargarDatosFinancieros();
  }, [usuario, cargarDatosFinancieros]);

  const agregarMovimiento = async (datos) => {
    try {
      setErrorFinanzas('');

      const categoriaId =
        datos.categoria_id ||
        buscarCategoriaId(
          datos.tipo,
          datos.categoria
        );

      if (!categoriaId) {
        throw new Error(
          'No se encontró una categoría válida para el movimiento'
        );
      }

      const payload = {
        categoria_id: categoriaId,
        tipo: datos.tipo,
        descripcion: datos.descripcion,
        monto: Number(datos.monto),
        fecha: convertirFechaAApi(datos.fecha)
      };

      const data = await movimientosApi.crear(payload);

      const movimientoNormalizado =
        normalizarMovimiento(data.movimiento);

      setMovimientos((prev) => [
        movimientoNormalizado,
        ...prev
      ]);

      await cargarReportes();

      return {
        ok: true,
        mensaje: data.mensaje,
        movimiento: movimientoNormalizado
      };
    } catch (error) {
      setErrorFinanzas(error.message);

      return {
        ok: false,
        mensaje: error.message
      };
    }
  };

  const actualizarMovimiento = async (
    id,
    datosActualizados
  ) => {
    try {
      setErrorFinanzas('');

      const categoriaId =
        datosActualizados.categoria_id ||
        buscarCategoriaId(
          datosActualizados.tipo,
          datosActualizados.categoria
        );

      if (!categoriaId) {
        throw new Error(
          'No se encontró una categoría válida para el movimiento'
        );
      }

      const payload = {
        categoria_id: categoriaId,
        tipo: datosActualizados.tipo,
        descripcion: datosActualizados.descripcion,
        monto: Number(datosActualizados.monto),
        fecha: convertirFechaAApi(datosActualizados.fecha)
      };

      const data = await movimientosApi.actualizar(
        id,
        payload
      );

      const movimientoNormalizado =
        normalizarMovimiento(data.movimiento);

      setMovimientos((prev) =>
        prev.map((mov) =>
          mov.id === id
            ? movimientoNormalizado
            : mov
        )
      );

      await cargarReportes();

      return {
        ok: true,
        mensaje: data.mensaje,
        movimiento: movimientoNormalizado
      };
    } catch (error) {
      setErrorFinanzas(error.message);

      return {
        ok: false,
        mensaje: error.message
      };
    }
  };

  const eliminarMovimiento = async (id) => {
    try {
      setErrorFinanzas('');

      const data = await movimientosApi.eliminar(id);

      setMovimientos((prev) =>
        prev.filter((mov) => mov.id !== id)
      );

      await cargarReportes();

      return {
        ok: true,
        mensaje: data.mensaje,
        id
      };
    } catch (error) {
      setErrorFinanzas(error.message);

      return {
        ok: false,
        mensaje: error.message
      };
    }
  };

  const crearCategoria = async (datos) => {
    try {
      setErrorFinanzas('');

      const data = await categoriasApi.crear(datos);

      const categoriaNormalizada =
        normalizarCategoria(data.categoria);

      setCategorias((prev) => [
        ...prev,
        categoriaNormalizada
      ]);

      return {
        ok: true,
        mensaje: data.mensaje,
        categoria: categoriaNormalizada
      };
    } catch (error) {
      setErrorFinanzas(error.message);

      return {
        ok: false,
        mensaje: error.message
      };
    }
  };

  const actualizarCategoria = async (id, datos) => {
    try {
      setErrorFinanzas('');

      const data = await categoriasApi.actualizar(
        id,
        datos
      );

      const categoriaNormalizada =
        normalizarCategoria(data.categoria);

      setCategorias((prev) =>
        prev.map((categoria) =>
          categoria.id === id
            ? categoriaNormalizada
            : categoria
        )
      );

      return {
        ok: true,
        mensaje: data.mensaje,
        categoria: categoriaNormalizada
      };
    } catch (error) {
      setErrorFinanzas(error.message);

      return {
        ok: false,
        mensaje: error.message
      };
    }
  };

  const eliminarCategoria = async (id) => {
    try {
      setErrorFinanzas('');

      const data = await categoriasApi.eliminar(id);

      setCategorias((prev) =>
        prev.filter((categoria) => categoria.id !== id)
      );

      return {
        ok: true,
        mensaje: data.mensaje,
        categoria: data.categoria
      };
    } catch (error) {
      setErrorFinanzas(error.message);

      return {
        ok: false,
        mensaje: error.message
      };
    }
  };

  const limpiarErrorFinanzas = () => {
    setErrorFinanzas('');
  };

  return (
    <FinanceContext.Provider
      value={{
        movimientos,
        categorias,
        categoriasGasto,
        categoriasIngreso,

        resumen,
        gastosPorCategoria,
        movimientosPorMes,

        cargandoFinanzas,
        errorFinanzas,
        limpiarErrorFinanzas,

        cargarCategorias,
        cargarMovimientos,
        cargarReportes,
        cargarDatosFinancieros,

        agregarMovimiento,
        actualizarMovimiento,
        eliminarMovimiento,

        crearCategoria,
        actualizarCategoria,
        eliminarCategoria
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useFinance() {
  return useContext(FinanceContext);
}