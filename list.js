/*
 * list.js
 * ------------------------------------------------------------
 * Prescription list
 *
 * Responsibilities:
 * - Load prescriptions from Firestore
 * - Search prescriptions
 * - Render prescription list
 * - Open view/edit modal
 * - Delete prescriptions
 * ------------------------------------------------------------
 */


/*
 * ============================================================
 * DOM REFERENCES
 * ============================================================
 */

const prescriptionList =
    document.getElementById("prescription-list");

const prescriptionSearch =
    document.getElementById("prescription-search");


/*
 * ============================================================
 * FIRESTORE
 * ============================================================
 */

const prescriptionsCollection =
    db.collection("prescriptions");


/*
 * ============================================================
 * STATE
 * ============================================================
 */

let prescriptions = [];


/*
 * ============================================================
 * PRESCRIPTION TYPE LABELS
 * ============================================================
 */

const prescriptionTypeLabels = {

    calorie: "Calorias",

    speed: "Velocidade",

    distance: "Distância",

    interval: "Intervalo",

    reps: "Repetições",

    time: "Tempo",

    watt: "Potência",

    revolution: "Rotações",

    stroke: "Remadas",

    weight: "Peso"
};


/*
 * ============================================================
 * UNIT LABELS
 * ============================================================
 */

const unitLabels = {

    cal: "Cal",

    joule: "Joule",

    "km/h": "km/h",

    "m/s": "m/s",

    m: "m",

    km: "km",

    second: "s",

    minute: "min",

    hour: "h",

    watt: "W",

    revolution: "rotações",

    stroke: "remadas",

    rep: "repetições",

    kg: "kg",

    lb: "lb"
};


/*
 * ============================================================
 * FORMAT VALUE
 * ============================================================
 */

function formatPrescriptionValue(
    prescription
) {

    /*
     * INTERVAL
     */

    if (
        prescription.externalLoad ===
        "interval"
    ) {

        const work =
            prescription.interval?.work;

        const rest =
            prescription.interval?.rest;


        if (!work || !rest) {
            return "Intervalo não definido";
        }


        return (
            `${formatNumber(work.value)} ` +
            `${getUnitLabel(work.unit)} ` +
            `trabalho · ` +
            `${formatNumber(rest.value)} ` +
            `${getUnitLabel(rest.unit)} ` +
            `descanso`
        );
    }


    /*
     * NORMAL VALUE
     */

    if (
        prescription.value === undefined ||
        prescription.value === null
    ) {
        return "Valor não definido";
    }


    const value =
        formatNumber(
            prescription.value
        );


    const unit =
        prescription.unit
            ? getUnitLabel(
                prescription.unit
            )
            : "";


    return unit
        ? `${value} ${unit}`
        : value;
}


/*
 * ============================================================
 * NUMBER FORMAT
 * ============================================================
 */

function formatNumber(value) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return "";
    }


    return Number(value).toLocaleString(
        "pt-PT",
        {
            maximumFractionDigits: 2
        }
    );
}


/*
 * ============================================================
 * UNIT LABEL
 * ============================================================
 */

function getUnitLabel(unit) {

    return unitLabels[unit] || unit;
}


/*
 * ============================================================
 * PRESCRIPTION TYPE LABEL
 * ============================================================
 */

function getPrescriptionTypeLabelForList(
    type
) {

    return (
        prescriptionTypeLabels[type] ||
        type
    );
}


/*
 * ============================================================
 * CREATE PRESCRIPTION DESCRIPTION
 * ============================================================
 *
 * This is the important part for identifying a prescription.
 *
 * Main value:
 *
 *     Exercise name
 *     Prescription value
 *
 * Example:
 *
 *     Agachamento
 *     80 kg
 *
 * Secondary value:
 *
 *     Peso
 *
 * ------------------------------------------------------------
 */

function getPrescriptionMainValue(
    prescription
) {

    const exerciseName =
        prescription.exerciseName ||
        "Exercício sem nome";

    const value =
        formatPrescriptionValue(
            prescription
        );


    return `
        <div class="prescription-exercise-name">
            ${escapeHtml(exerciseName)}
        </div>

        <div class="prescription-value">
            ${escapeHtml(value)}
        </div>
    `;
}


/*
 * ============================================================
 * ESCAPE HTML
 * ============================================================
 *
 * Exercise names are user-entered data, so they should not be
 * inserted directly into innerHTML.
 */

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/*
 * ============================================================
 * RENDER LIST
 * ============================================================
 */

function renderPrescriptions(
    data
) {

    prescriptionList.innerHTML = "";


    /*
     * Empty state
     */

    if (!data.length) {

        prescriptionList.innerHTML = `
            <p class="list-message">
                Nenhuma prescrição encontrada.
            </p>
        `;

        return;
    }


    data.forEach(
        prescription => {

            const item =
                document.createElement("div");

            item.className =
                "list-item";


            /*
             * ------------------------------------------------
             * MAIN
             * ------------------------------------------------
             */

            const main =
                document.createElement("div");

            main.className =
                "list-item-main";


            const mainValue =
                document.createElement("div");

            mainValue.className =
                "list-item-main-value";

            mainValue.innerHTML =
                getPrescriptionMainValue(
                    prescription
                );


            /*
             * ------------------------------------------------
             * SECONDARY
             * ------------------------------------------------
             */

            const secondaryValue =
                document.createElement("div");

            secondaryValue.className =
                "list-item-secondary-value";

            secondaryValue.textContent =
                getPrescriptionTypeLabelForList(
                    prescription.externalLoad
                );


            main.appendChild(
                mainValue
            );

            main.appendChild(
                secondaryValue
            );


            /*
             * ------------------------------------------------
             * ACTIONS
             * ------------------------------------------------
             */

            const actions =
                document.createElement("div");

            actions.className =
                "list-item-actions";


            /*
             * VIEW
             */

            const viewButton =
                document.createElement("button");

            viewButton.className =
                "list-action-view";

            viewButton.dataset.id =
                prescription.documentId;

            viewButton.title =
                "Visualizar";

            viewButton.innerHTML = `
                <img
                    src="https://personalcross.github.io/assets/store/eye.png"
                    alt="Visualizar"
                >
            `;


            /*
             * EDIT
             */

            const editButton =
                document.createElement("button");

            editButton.className =
                "list-action-edit";

            editButton.dataset.id =
                prescription.documentId;

            editButton.title =
                "Editar";

            editButton.innerHTML = `
                <img
                    src="https://personalcross.github.io/assets/store/pencil.png"
                    alt="Editar"
                >
            `;


            /*
             * DELETE
             */

            const deleteButton =
                document.createElement("button");

            deleteButton.className =
                "list-action-delete";

            deleteButton.dataset.id =
                prescription.documentId;

            deleteButton.title =
                "Eliminar";

            deleteButton.innerHTML = `
                <img
                    src="https://personalcross.github.io/assets/store/trash.png"
                    alt="Eliminar"
                >
            `;


            actions.appendChild(
                viewButton
            );

            actions.appendChild(
                editButton
            );

            actions.appendChild(
                deleteButton
            );


            /*
             * ------------------------------------------------
             * COMPLETE ITEM
             * ------------------------------------------------
             */

            item.appendChild(
                main
            );

            item.appendChild(
                actions
            );


            prescriptionList.appendChild(
                item
            );
        }
    );
}


/*
 * ============================================================
 * LOAD PRESCRIPTIONS
 * ============================================================
 *
 * This function is intentionally global because modal.js
 * calls it after saving/editing.
 */

async function loadPrescriptions() {

    try {

        prescriptionList.innerHTML = `
            <p class="list-message">
                A carregar prescrições...
            </p>
        `;


        const snapshot =
            await prescriptionsCollection
                .orderBy("exerciseName")
                .get();


        prescriptions =
            snapshot.docs.map(
                doc => ({

                    documentId:
                        doc.id,

                    ...doc.data()

                })
            );


        renderPrescriptions(
            prescriptions
        );


    } catch (error) {

        console.error(
            "Erro ao carregar prescrições:",
            error
        );


        prescriptionList.innerHTML = `
            <p class="list-message">
                Não foi possível carregar as prescrições.
            </p>
        `;
    }
}


/*
 * ============================================================
 * SEARCH
 * ============================================================
 */

function filterPrescriptions(
    searchTerm
) {

    const normalizedSearch =
        searchTerm
            .trim()
            .toLocaleLowerCase(
                "pt-PT"
            );


    if (!normalizedSearch) {

        renderPrescriptions(
            prescriptions
        );

        return;
    }


    const filtered =
        prescriptions.filter(
            prescription => {

                const exerciseName =
                    (
                        prescription.exerciseName ||
                        ""
                    ).toLocaleLowerCase(
                        "pt-PT"
                    );


                const type =
                    getPrescriptionTypeLabelForList(
                        prescription.externalLoad
                    ).toLocaleLowerCase(
                        "pt-PT"
                    );


                const value =
                    formatPrescriptionValue(
                        prescription
                    ).toLocaleLowerCase(
                        "pt-PT"
                    );


                return (
                    exerciseName.includes(
                        normalizedSearch
                    ) ||

                    type.includes(
                        normalizedSearch
                    ) ||

                    value.includes(
                        normalizedSearch
                    )
                );
            }
        );


    renderPrescriptions(
        filtered
    );
}


prescriptionSearch.addEventListener(
    "input",
    event => {

        filterPrescriptions(
            event.target.value
        );

    }
);


/*
 * ============================================================
 * FIND PRESCRIPTION
 * ============================================================
 */

function getPrescriptionById(
    documentId
) {

    return prescriptions.find(
        prescription =>
            prescription.documentId ===
            documentId
    );
}


/*
 * ============================================================
 * VIEW
 * ============================================================
 */

function viewPrescription(
    documentId
) {

    const prescription =
        getPrescriptionById(
            documentId
        );


    if (!prescription) {

        M.toast({
            html:
                "Prescrição não encontrada."
        });

        return;
    }


    openPrescriptionModal(
        "view",
        prescription
    );
}


/*
 * ============================================================
 * EDIT
 * ============================================================
 */

function editPrescription(
    documentId
) {

    const prescription =
        getPrescriptionById(
            documentId
        );


    if (!prescription) {

        M.toast({
            html:
                "Prescrição não encontrada."
        });

        return;
    }


    openPrescriptionModal(
        "edit",
        prescription
    );
}


/*
 * ============================================================
 * DELETE
 * ============================================================
 */

async function deletePrescription(
    documentId
) {

    const prescription =
        getPrescriptionById(
            documentId
        );


    if (!prescription) {

        M.toast({
            html:
                "Prescrição não encontrada."
        });

        return;
    }


    const description =
        `${prescription.exerciseName} — ` +
        `${formatPrescriptionValue(
            prescription
        )}`;


    const confirmed =
        confirm(
            `Tem a certeza que pretende eliminar ` +
            `a prescrição "${description}"?`
        );


    if (!confirmed) {
        return;
    }


    try {

        await prescriptionsCollection
            .doc(documentId)
            .delete();


        M.toast({
            html:
                "Prescrição eliminada com sucesso."
        });


        await loadPrescriptions();


    } catch (error) {

        console.error(
            "Erro ao eliminar prescrição:",
            error
        );


        M.toast({
            html:
                "Não foi possível eliminar a prescrição."
        });
    }
}


/*
 * ============================================================
 * ACTION DELEGATION
 * ============================================================
 */

prescriptionList.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "button"
            );


        if (!button) {
            return;
        }


        const documentId =
            button.dataset.id;


        if (!documentId) {
            return;
        }


        if (
            button.classList.contains(
                "list-action-view"
            )
        ) {

            viewPrescription(
                documentId
            );

            return;
        }


        if (
            button.classList.contains(
                "list-action-edit"
            )
        ) {

            editPrescription(
                documentId
            );

            return;
        }


        if (
            button.classList.contains(
                "list-action-delete"
            )
        ) {

            deletePrescription(
                documentId
            );

        }
    }
);


/*
 * ============================================================
 * INITIAL LOAD
 * ============================================================
 */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadPrescriptions();

    }
);
