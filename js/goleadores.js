// ============================================
// GOLEADORES: quién la mete y cuántas
// ============================================

const estadoGoleadores = {
    tabla: {},
    plantillas: {},
    historial: []
};

function reiniciarGoleadores() {
    estadoGoleadores.tabla = {};
    estadoGoleadores.plantillas = {};
}

// Cada club tiene tres posibles goleadores estables (su figura y dos más).
function plantillaGoleadores(clubId) {
    if (!estadoGoleadores.plantillas[clubId]) {
        const nombres = [];
        if (typeof figuraEnClub === "function") {
            figuraEnClub(clubId).filter(function(f) { return f.posicion !== "ARQ"; })
                .slice(0, 2).forEach(function(f) { nombres.push(f.nombre); });
        }
        let guardia = 0;
        while (nombres.length < 3 && guardia++ < 30) {
            const nuevo = elegir(NOMBRES_PILA) + " " + elegir(APELLIDOS);
            if (nombres.indexOf(nuevo) === -1) nombres.push(nuevo);
        }
        estadoGoleadores.plantillas[clubId] = nombres.slice(0, 3);
    }
    return estadoGoleadores.plantillas[clubId];
}

function nombreGoleadorDe(clubId) {
    const plantilla = plantillaGoleadores(clubId);
    const r = Math.random();
    if (r < 0.5) return plantilla[0];
    if (r < 0.85) return plantilla[1];
    return plantilla[2];
}

function crearGol(clubId, condicion) {
    const nombre = nombreGoleadorDe(clubId);
    const clave = nombre + "|" + clubId;
    if (!estadoGoleadores.tabla[clave]) {
        estadoGoleadores.tabla[clave] = {
            nombre: nombre,
            clubId: clubId,
            club: EQUIPOS[clubId] ? EQUIPOS[clubId].nombre : "",
            goles: 0
        };
    }
    estadoGoleadores.tabla[clave].goles++;
    return {
        nombre: nombre,
        clubId: clubId,
        minuto: entre(2, 90),
        condicion: condicion
    };
}

function asignarGoleadoresDelPartido(localId, visitanteId, resultado) {
    const goles = [];
    for (let i = 0; i < resultado.golesLocal; i++) goles.push(crearGol(localId, "local"));
    for (let i = 0; i < resultado.golesVisitante; i++) goles.push(crearGol(visitanteId, "visitante"));
    goles.sort(function(a, b) { return a.minuto - b.minuto; });
    return goles;
}

function tablaGoleadores(cantidad) {
    const lista = Object.keys(estadoGoleadores.tabla).map(function(k) { return estadoGoleadores.tabla[k]; });
    lista.sort(function(a, b) {
        if (b.goles !== a.goles) return b.goles - a.goles;
        return a.nombre.localeCompare(b.nombre);
    });
    return cantidad ? lista.slice(0, cantidad) : lista;
}

function goleadorDelClub(clubId) {
    const lista = Object.keys(estadoGoleadores.tabla)
        .map(function(k) { return estadoGoleadores.tabla[k]; })
        .filter(function(g) { return g.clubId === Number(clubId); })
        .sort(function(a, b) { return b.goles - a.goles; });
    return lista[0] || null;
}

function goleadoresDelPartido(resultado) {
    if (!resultado || !resultado.goles) return [];
    return resultado.goles;
}
