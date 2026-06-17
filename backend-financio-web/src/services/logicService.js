import { readFileSync } from 'fs';
import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const pl = require('tau-prolog');
require('tau-prolog/modules/lists')(pl);

const __dirname = dirname(fileURLToPath(import.meta.url));
const rulesPath = join(__dirname, '../logic/financionRules.pl');

const cargarReglas = () => readFileSync(rulesPath, 'utf8');

export const consultarProlog = (hechosDinamicos, consulta) =>
    new Promise((resolve, reject) => {
        const session = pl.create(10000);
        const programa = `${cargarReglas()}\n\n${hechosDinamicos}`;
        const resultados = [];

        session.consult(programa, {
            success: () => {
                session.query(consulta, {
                    success: () => {
                        session.answers((answer) => {
                            if (answer === false) {
                                resolve(resultados);
                                return;
                            }

                            resultados.push(session.format_answer(answer));
                        });
                    },
                    error: reject
                });
            },
            error: reject
        });
    });
