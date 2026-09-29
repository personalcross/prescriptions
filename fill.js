/*
 * ============================================================
 * EXERCISE TYPES
 * ============================================================
 */

const exerciseTypes = {
    "body weight": {
        label: "Peso corporal"
    },

    "free weight": {
        label: "Peso livre"
    },

    "machine weight": {
        label: "Máquina"
    },

    "aerobic exercise": {
        label: "Exercício aeróbico"
    },

    "high intensity interval training": {
        label: "HIIT"
    },

    "mind body exercise": {
        label: "Mind-body"
    }
};


/*
 * ============================================================
 * PRESCRIPTION / EXTERNAL LOAD TYPES
 * ============================================================
 */

const prescriptionTypes = {

    calorie: {
        label: "Calorias"
    },

    speed: {
        label: "Velocidade"
    },

    distance: {
        label: "Distância"
    },

    interval: {
        label: "Intervalo"
    },

    reps: {
        label: "Repetições"
    },

    time: {
        label: "Tempo"
    },

    watt: {
        label: "Potência"
    },

    revolution: {
        label: "Rotações"
    },

    stroke: {
        label: "Remadas"
    },

    weight: {
        label: "Peso"
    }
};

/*
 * ============================================================
 * UNITS
 * ============================================================
 *
 * These are kept separate because the same prescription type
 * may have different valid units.
 */

const prescriptionUnits = {

    calorie: [
        {
            value: "cal",
            label: "Cal"
        },
        {
            value: "joule",
            label: "Joule"
        }
    ],

    speed: [
        {
            value: "km/h",
            label: "km/h"
        },
        {
            value: "m/s",
            label: "m/s"
        }
    ],

    distance: [
        {
            value: "m",
            label: "m"
        },
        {
            value: "km",
            label: "km"
        }
    ],

    interval: [
        {
            value: "s",
            label: "s"
        },
        {
            value: "min",
            label: "min"
        }
    ],

    reps: [
        {
            value: "rep",
            label: "Repetições"
        }
    ],

    time: [
        {
            value: "s",
            label: "s"
        },
        {
            value: "min",
            label: "min"
        },
        {
            value: "h",
            label: "h"
        }
    ],

    watt: [
        {
            value: "W",
            label: "W"
        }
    ],

    revolution: [
        {
            value: "revolution",
            label: "Rotações"
        }
    ],

    stroke: [
        {
            value: "stroke",
            label: "Remadas"
        }
    ],

    weight: [
        {
            value: "kg",
            label: "kg"
        },
        {
            value: "lb",
            label: "lb"
        }
    ]
};

/*
 * ============================================================
 * EXERCISES
 * ============================================================
 *
 * Loaded from Firestore and kept in memory so modal.js and
 * list.js can use the same exercise information.
 */

let exercises = [];

/*
 * Load exercises from Firestore.
 *
 * Only active exercises are offered when creating a new
 * prescription.
 */

async function loadExercisesForPrescription() {

    try {

        const snapshot = await db.collection("exercises")
            .orderBy("name")
            .get();

        const allExercises = snapshot.docs.map(doc => ({
            documentId: doc.id,
            ...doc.data()
        }));

        exercises = allExercises.filter(exercise =>
            (exercise.isActive === true)
        )
        
        populateExerciseSelect();

    } catch (error) {

        console.error(
            "Erro ao carregar exercícios:",
            error
        );

        M.toast({
            html: "Não foi possível carregar os exercícios."
        });
    }
}

/*
 * Populate exercise selector.
 */

function populateExerciseSelect() {

    document.getElementById("prescription-exercise").innerHTML = `
        <option value="" disabled selected>Selecione o exercício</option>
    `;

    exercises.forEach(exercise => {

        const option =
            document.createElement("option");

        option.value = exercise.documentId;
        option.textContent = exercise.name;

        document.getElementById("prescription-exercise").appendChild(option);
    });

    refreshExerciseSelect();
}

/*
 * Refresh Materialize select.
 */

function refreshExerciseSelect() {

    const existingInstance =
        M.FormSelect.getInstance(
            document.getElementById("prescription-exercise")
        );

    if (existingInstance) {
        existingInstance.destroy();
    }

    M.FormSelect.init(
        document.getElementById("prescription-exercise")
    );
}

/*
 * ============================================================
 * HELPER FUNCTIONS
 * ============================================================
 */

/*
 * Return the human-readable exercise type.
 */

function getExerciseTypeLabel(type) {

    return exerciseTypes[type]?.label || type;
}


/*
 * Return the human-readable prescription type.
 */

function getPrescriptionTypeLabel(type) {

    return prescriptionTypes[type]?.label || type;
}


/*
 * Return available units for a prescription type.
 */

function getPrescriptionUnits(type) {

    return prescriptionUnits[type] || [];
}


/*
 * Find an exercise by Firestore document ID.
 */

function getExerciseById(documentId) {

    return exercises.find(
        exercise => exercise.documentId === documentId
    );
}

/*
 * ============================================================
 * INITIALIZATION
 * ============================================================
 */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadExercisesForPrescription();

    }
);
