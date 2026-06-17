
% Reglas lógicas del sistema Financio

% Categorías del sistema
categoria(comida).
categoria(transporte).
categoria(salud).
categoria(educacion).
categoria(renta).
categoria(servicios).
categoria(entretenimiento).
categoria(compras).
categoria(salario).
categoria(otros).

% Tipos de transacción

tipo(ingreso).
tipo(gasto).

% Categorías prioritarias

categoria_prioritaria(comida).
categoria_prioritaria(transporte).
categoria_prioritaria(salud).
categoria_prioritaria(educacion).
categoria_prioritaria(renta).
categoria_prioritaria(servicios).

% Categorías no prioritarias 

categoria_ocio(entretenimiento).
categoria_ocio(compras).

% Límites recomendados por categoría

limite_categoria(comida, 3000).
limite_categoria(transporte, 1500).
limite_categoria(salud, 2500).
limite_categoria(educacion, 2500).
limite_categoria(renta, 5000).
limite_categoria(servicios, 2000).
limite_categoria(entretenimiento, 1000).
limite_categoria(compras, 1500).

% Reglas de clasificación

es_gasto(U, Id) :-
    transaccion(U, Id, _, _, gasto).

es_ingreso(U, Id) :-
    transaccion(U, Id, _, _, ingreso).

gasto_prioritario(U, Id) :-
    transaccion(U, Id, C, _, gasto),
    categoria_prioritaria(C).

gasto_innecesario(U, Id) :-
    transaccion(U, Id, C, _, gasto),
    categoria_ocio(C).


% Reglas de cálculo

suma_lista([], 0).

suma_lista([H|T], Total) :-
    suma_lista(T, Resto),
    Total is H + Resto.

total_ingresos(U, Total) :-
    findall(M, transaccion(U, _, _, M, ingreso), Montos),
    suma_lista(Montos, Total).

total_gastos(U, Total) :-
    findall(M, transaccion(U, _, _, M, gasto), Montos),
    suma_lista(Montos, Total).

saldo(U, Saldo) :-
    total_ingresos(U, Ingresos),
    total_gastos(U, Gastos),
    Saldo is Ingresos - Gastos.

gasto_total_categoria(U, C, Total) :-
    findall(M, transaccion(U, _, C, M, gasto), Montos),
    suma_lista(Montos, Total).

% Categorías problemáticas

sobreconsumo_categoria(U, C) :-
    transaccion(U, _, C, _, gasto),
    gasto_total_categoria(U, C, Total),
    limite_categoria(C, Limite),
    Total > Limite.

categoria_problematica(U, C) :-
    sobreconsumo_categoria(U, C).

categoria_problematica(U, C) :-
    transaccion(U, _, C, _, gasto),
    gasto_total_categoria(U, C, Total),
    categoria_ocio(C),
    Total > 0.

% Recomendaciones

recomendar_ahorro(U) :-
    gasto_innecesario(U, _).

recomendar_ahorro(U) :-
    categoria_problematica(U, _).

saldo_bajo(U) :-
    saldo(U, S),
    S < 1000.

riesgo_financiero(U) :-
    saldo_bajo(U),
    categoria_problematica(U, _).
