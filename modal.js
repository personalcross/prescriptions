/*
 * modal.js
 * ------------------------------------------------------------
 * Prescription modal
 *
 * Responsibilities:
 * - Handle modal state
 * - Step 1: select exercise
 * - Step 2: dynamically generate prescription fields
 * - Validate prescription
 * - Save prescription to Firestore
 * - Support Add / View / Edit modes
 * ------------------------------------------------------------
 */


/*
 * ============================================================
 * DOM REFERENCES
 * ============================================================
 */

const prescriptionModal =
    document.getElementById("prescription-modal");

const prescriptionModalTitle =
    document.getElementById("prescription-modal-title");

const prescriptionStep1 =
    document.getElementById("prescription-step1");

const prescriptionStep2 =
    document.getElementById("prescription-step2");

const prescriptionFormStep1 =
    document.getElementById("prescription-form-step1");

const prescriptionFormStep2 =
    document.getElementById("prescription-form-step2");

const prescriptionFields =
    document.getElementById("prescription-fields");

const btnCancelPrescription =
    document.getElementById("btn-cancel-prescription");

const btnAdvancePrescription =
    document.getElementById("btn-advance-prescription");

const btnBackPrescription =
    document.getElementById("btn-back-prescription");

const btnSavePrescription =
    document.getElementById("btn-save-prescription");

/*
 * ============================================================
 * MODAL STATE
 * ============================================================
 */

let prescriptionModalInstance = null;

let prescriptionModalMode = "add";

let currentPrescription = null;

let selectedExercise = null;

/*
 * ============================================================
 * STEP 2 FIELD DEFINITIONS
 * ============================================================
 *
 * externalLoad is the primary determinant of the fields.
 *
 * exerciseType remains available through selectedExercise
 * and can be used later for specific behavior.
 */


/*
 * Simple numeric prescription
 */

const prescriptionFieldDefinitions = {

    calorie: {
        title: "Calorias",

        fields: [
            {
                id: "value",
                type: "number",
                label: "Calorias",
                min: 0,
                step: "any",
                required: true
            },

            {
                id: "unit",
                type: "select",
                label: "Unidade",
                required: true,

                options: [
                    {
                        value: "cal",
                        label: "Cal"
                    },
                    {
                        value: "joule",
                        label: "Joule"
                    }
                ]
            }
        ]
    },


    speed: {
        title: "Velocidade",

        fields: [
            {
                id: "value",
                type: "number",
                label: "Velocidade",
                min: 0,
                step: "any",
                required: true
            },

            {
                id: "unit",
                type: "select",
                label: "Unidade",
                required: true,

                options: [
                    {
                        value: "km/h",
                        label: "km/h"
                    },
                    {
                        value: "m/s",
                        label: "m/s"
                    }
                ]
            }
        ]
    },


    distance: {
        title: "Distância",

        fields: [
            {
                id: "value",
                type: "number",
                label: "Distância",
                min: 0,
                step: "any",
                required: true
            },

            {
                id: "unit",
                type: "select",
                label: "Unidade",
                required: true,

                options: [
                    {
                        value: "m",
                        label: "Metros"
                    },
                    {
                        value: "km",
                        label: "Quilómetros"
                    }
                ]
            }
        ]
    },


    reps: {
        title: "Repetições",

        fields: [
            {
                id: "value",
                type: "number",
                label: "Repetições",
                min: 1,
                step: 1,
                required: true
            }
        ]
    },


    time: {
        title: "Tempo",

        fields: [
            {
                id: "value",
                type: "number",
                label: "Tempo",
                min: 0,
                step: "any",
                required: true
            },

            {
                id: "unit",
                type: "select",
                label: "Unidade",
                required: true,

                options: [
                    {
                        value: "second",
                        label: "Segundos"
                    },
                    {
                        value: "minute",
                        label: "Minutos"
                    },
                    {
                        value: "hour",
                        label: "Horas"
                    }
                ]
            }
        ]
    },


    watt: {
        title: "Potência",

        fields: [
            {
                id: "value",
                type: "number",
                label: "Potência",
                min: 0,
                step: "any",
                required: true
            },

            {
                id: "unit",
                type: "select",
                label: "Unidade",
                required: true,

                options: [
                    {
                        value: "watt",
                        label: "W"
                    }
                ]
            }
        ]
    },


    revolution: {
        title: "Rotações",

        fields: [
            {
                id: "value",
                type: "number",
                label: "Rotações",
                min: 0,
                step: 1,
                required: true
            }
        ]
    },


    stroke: {
        title: "Remadas",

        fields: [
            {
                id: "value",
                type: "number",
                label: "Remadas",
                min: 0,
                step: 1,
                required: true
            }
        ]
    },


    weight: {
        title: "Peso",

        fields: [
            {
                id: "value",
                type: "number",
                label: "Peso",
                min: 0,
                step: "any",
                required: true
            },

            {
                id: "unit",
                type: "select",
                label: "Unidade",
                required: true,

                options: [
                    {
                        value: "kg",
                        label: "kg"
                    },
                    {
                        value: "lb",
                        label: "lb"
                    }
                ]
            }
        ]
    },

    interval: {
        title: "Intervalo",

        fields: [
            {
                id: "workValue",
                type: "number",
                label: "Tempo de trabalho",
                min: 0,
                step: "any",
                required: true
            },

            {
                id: "workUnit",
                type: "select",
                label: "Unidade",
                required: true,

                options: [
                    {
                        value: "second",
                        label: "Segundos"
                    },
                    {
                        value: "minute",
                        label: "Minutos"
                    }
                ]
            },

            {
                id: "restValue",
                type: "number",
                label: "Tempo de descanso",
                min: 0,
                step: "any",
                required: true
            },

            {
                id: "restUnit",
                type: "select",
                label: "Unidade",
                required: true,

                options: [
                    {
                        value: "second",
                        label: "Segundos"
                    },
                    {
                        value: "minute",
                        label: "Minutos"
                    }
                ]
            }
        ]
    }

};

/*
 * ============================================================
 * MODAL MODE
 * ============================================================
 */

function setPrescriptionModalMode(mode) {

    prescriptionModalMode = mode;

    const isView = mode === "view";

    document.getElementById("prescription-exercise").disabled = isView;

    btnAdvancePrescription.style.display =
        isView ? "none" : "";

    btnSavePrescription.style.display =
        isView ? "none" : "";

    btnBackPrescription.style.display =
        isView ? "none" : "";

    /*
     * In view mode the user can only close the modal.
     */

    if (isView) {
        btnCancelPrescription.textContent = "Fechar";
    } else {
        btnCancelPrescription.textContent = "Cancelar";
    }
}

/*
 * ============================================================
 * STEP CONTROL
 * ============================================================
 */

function showPrescriptionStep(step) {

    if (step === 1) {

        prescriptionStep1.style.display = "";
        prescriptionStep2.style.display = "none";

        prescriptionModalTitle.textContent =
            prescriptionModalMode === "add"
                ? "Adicionar prescrição - Etapa 1/2"
                : prescriptionModalMode === "edit"
                    ? "Editar prescrição - Etapa 1/2"
                    : "Visualizar prescrição - Etapa 1/2";

    } else {

        prescriptionStep1.style.display = "none";
        prescriptionStep2.style.display = "";

        const title =
            selectedExercise
                ? `${selectedExercise.name} - ${getPrescriptionTypeLabel(selectedExercise.externalLoad)}`
                : "Prescrição";

        prescriptionModalTitle.textContent =
            prescriptionModalMode === "add"
                ? `Adicionar prescrição - Etapa 2/2`
                : prescriptionModalMode === "edit"
                    ? `Editar prescrição - Etapa 2/2`
                    : `Visualizar prescrição - Etapa 2/2`;
    }
}

/*
 * ============================================================
 * RESET
 * ============================================================
 */

function resetPrescriptionForm() {

    prescriptionFormStep1.reset();
    prescriptionFormStep2.reset();

    prescriptionFields.innerHTML = "";

    selectedExercise = null;
    currentPrescription = null;

    document.getElementById("prescription-exercise").disabled = false;

    prescriptionModalTitle.textContent =
        "Adicionar prescrição - Etapa 1/2";

    prescriptionStep1.style.display = "";
    prescriptionStep2.style.display = "none";

    btnAdvancePrescription.style.display = "";
    btnSavePrescription.style.display = "";
    btnBackPrescription.style.display = "";

    btnCancelPrescription.textContent = "Cancelar";
}

/*
 * ============================================================
 * RENDER STEP 2
 * ============================================================
 */

function renderPrescriptionFields(externalLoad) {

    prescriptionFields.innerHTML = "";

    const definition =
        prescriptionFieldDefinitions[externalLoad];

    if (!definition) {

        prescriptionFields.innerHTML = `
            <p>
                Tipo de prescrição não suportado:
                <strong>${externalLoad}</strong>
            </p>
        `;

        return;
    }


    /*
     * Show exercise information at the top.
     */

    const exerciseInfo =
        document.createElement("div");

    exerciseInfo.className =
        "prescription-exercise-info";

    exerciseInfo.innerHTML = `
        <p>
            <strong>Exercício:</strong>
            ${selectedExercise.name}
        </p>

        <p>
            <strong>Tipo:</strong>
            ${getExerciseTypeLabel(
                selectedExercise.exerciseType
            )}
        </p>

        <p>
            <strong>Prescrição:</strong>
            ${definition.title}
        </p>
    `;

    prescriptionFields.appendChild(
        exerciseInfo
    );


    /*
     * Generate fields.
     */

    definition.fields.forEach(field => {

        const wrapper =
            document.createElement("div");

        wrapper.className =
            "input-field";


        /*
         * SELECT
         */

        if (field.type === "select") {

            const select =
                document.createElement("select");

            select.id =
                `prescription-${field.id}`;

            select.required =
                field.required === true;

            const placeholder =
                document.createElement("option");

            placeholder.value = "";
            placeholder.disabled = true;
            placeholder.selected = true;

            placeholder.textContent =
                "Selecione";

            select.appendChild(
                placeholder
            );


            field.options.forEach(option => {

                const optionElement =
                    document.createElement("option");

                optionElement.value =
                    option.value;

                optionElement.textContent =
                    option.label;

                select.appendChild(
                    optionElement
                );
            });


            const label =
                document.createElement("label");

            label.textContent =
                field.label;

            wrapper.appendChild(select);
            wrapper.appendChild(label);

        }


        /*
         * NUMBER
         */

        else if (field.type === "number") {

            const input =
                document.createElement("input");

            input.type = "number";

            input.id =
                `prescription-${field.id}`;

            input.required =
                field.required === true;

            if (field.min !== undefined) {
                input.min = field.min;
            }

            if (field.step !== undefined) {
                input.step = field.step;
            }

            const label =
                document.createElement("label");

            label.htmlFor =
                input.id;

            label.textContent =
                field.label;

            wrapper.appendChild(input);
            wrapper.appendChild(label);
        }


        prescriptionFields.appendChild(
            wrapper
        );
    });


    /*
     * Materialize needs to initialize dynamically-created
     * selects.
     */

    refreshPrescriptionSelects();
}

/*
 * ============================================================
 * MATERIALIZE SELECTS
 * ============================================================
 */

function refreshPrescriptionSelects() {

    const selects =
        prescriptionFields.querySelectorAll(
            "select"
        );

    selects.forEach(select => {

        M.FormSelect.init(select);

    });
}

/*
 * ============================================================
 * GET STEP 2 DATA
 * ============================================================
 */

function getPrescriptionFormData() {

    if (!selectedExercise) {
        throw new Error(
            "Nenhum exercício selecionado."
        );
    }


    const externalLoad =
        selectedExercise.externalLoad;


    /*
     * INTERVAL
     */

    if (externalLoad === "interval") {

        const workValue =
            document.getElementById(
                "prescription-workValue"
            );

        const workUnit =
            document.getElementById(
                "prescription-workUnit"
            );

        const restValue =
            document.getElementById(
                "prescription-restValue"
            );

        const restUnit =
            document.getElementById(
                "prescription-restUnit"
            );


        return {

            externalLoad: "interval",

            interval: {

                work: {
                    value: Number(
                        workValue.value
                    ),

                    unit:
                        workUnit.value
                },

                rest: {
                    value: Number(
                        restValue.value
                    ),

                    unit:
                        restUnit.value
                }
            }
        };
    }


    /*
     * NORMAL VALUE + OPTIONAL UNIT
     */

    const valueInput =
        document.getElementById(
            "prescription-value"
        );

    const unitInput =
        document.getElementById(
            "prescription-unit"
        );


    const data = {

        externalLoad,

        value: Number(
            valueInput.value
        )
    };


    if (unitInput) {
        data.unit = unitInput.value;
    }


    return data;
}

/*
 * ============================================================
 * VALIDATION
 * ============================================================
 */

function validatePrescriptionStep1() {

    if (!document.getElementById("prescription-exercise").value) {

        M.toast({
            html: "Selecione um exercício."
        });

        return false;
    }

    return true;
}

function validatePrescriptionStep2() {

    const form =
        prescriptionFormStep2;

    if (!form.checkValidity()) {

        form.reportValidity();

        return false;
    }


    const externalLoad =
        selectedExercise.externalLoad;


    /*
     * Validate interval values explicitly.
     */

    if (externalLoad === "interval") {

        const workValue =
            Number(
                document.getElementById(
                    "prescription-workValue"
                ).value
            );

        const restValue =
            Number(
                document.getElementById(
                    "prescription-restValue"
                ).value
            );


        if (workValue <= 0) {

            M.toast({
                html:
                    "O tempo de trabalho deve ser maior que zero."
            });

            return false;
        }


        if (restValue < 0) {

            M.toast({
                html:
                    "O tempo de descanso não pode ser negativo."
            });

            return false;
        }
    }


    return true;
}

/*
 * ============================================================
 * OPEN MODAL
 * ============================================================
 */

function openPrescriptionModal(
    mode = "add",
    prescription = null
) {

    prescriptionModalMode = mode;

    resetPrescriptionForm();

    setPrescriptionModalMode(mode);


    /*
     * ADD
     */

    if (mode === "add") {

        showPrescriptionStep(1);

        prescriptionModalInstance.open();

        return;
    }


    /*
     * VIEW / EDIT
     */

    if (!prescription) {

        console.error(
            "Prescrição não fornecida."
        );

        return;
    }


    currentPrescription =
        prescription;


    const exercise =
        getExerciseById(
            prescription.exerciseId
        );


    if (!exercise) {

        M.toast({
            html:
                "O exercício desta prescrição não foi encontrado."
        });

        return;
    }


    selectedExercise =
        exercise;


    document.getElementById("prescription-exercise").value =
        exercise.documentId;

    refreshExerciseSelect();


    /*
     * Generate Step 2.
     */

    renderPrescriptionFields(
        exercise.externalLoad
    );


    /*
     * Populate stored values.
     */

    populatePrescriptionFields(
        prescription
    );


    /*
     * View/Edit starts directly on Step 2.
     */

    showPrescriptionStep(2);

    prescriptionModalInstance.open();
}

/*
 * ============================================================
 * POPULATE EXISTING PRESCRIPTION
 * ============================================================
 */

function populatePrescriptionFields(
    prescription
) {

    const externalLoad =
        prescription.externalLoad;


    /*
     * INTERVAL
     */

    if (externalLoad === "interval") {

        const workValue =
            document.getElementById(
                "prescription-workValue"
            );

        const workUnit =
            document.getElementById(
                "prescription-workUnit"
            );

        const restValue =
            document.getElementById(
                "prescription-restValue"
            );

        const restUnit =
            document.getElementById(
                "prescription-restUnit"
            );


        if (prescription.interval) {

            workValue.value =
                prescription.interval.work?.value ?? "";

            workUnit.value =
                prescription.interval.work?.unit ?? "";

            restValue.value =
                prescription.interval.rest?.value ?? "";

            restUnit.value =
                prescription.interval.rest?.unit ?? "";
        }


        refreshPrescriptionSelects();

        return;
    }


    /*
     * NORMAL VALUE
     */

    const valueInput =
        document.getElementById(
            "prescription-value"
        );

    const unitInput =
        document.getElementById(
            "prescription-unit"
        );


    if (valueInput) {

        valueInput.value =
            prescription.value ?? "";
    }


    if (unitInput) {

        unitInput.value =
            prescription.unit ?? "";
    }


    refreshPrescriptionSelects();

    /*
     * Materialize labels need to be activated after
     * programmatically filling inputs.
     */

    M.updateTextFields();
}

/*
 * ============================================================
 * SAVE
 * ============================================================
 */

async function savePrescription() {

    if (!validatePrescriptionStep1()) {
        return;
    }

    if (!validatePrescriptionStep2()) {
        return;
    }


    try {

        btnSavePrescription.disabled = true;


        const formData =
            getPrescriptionFormData();


        const now =
            firebase.firestore.FieldValue.serverTimestamp();


        const prescriptionData = {

            exerciseId:
                selectedExercise.documentId,

            exerciseName:
                selectedExercise.name,

            exerciseType:
                selectedExercise.exerciseType,

            complexityType:
                selectedExercise.complexityType,

            externalLoad:
                formData.externalLoad,

            isActive: true,

            updatedAt:
                now
        };


        /*
         * Copy prescription-specific data.
         */

        if (
            formData.externalLoad ===
            "interval"
        ) {

            prescriptionData.interval =
                formData.interval;

        } else {

            prescriptionData.value =
                formData.value;

            if (formData.unit) {

                prescriptionData.unit =
                    formData.unit;
            }
        }


        /*
         * ADD
         */

        if (prescriptionModalMode === "add") {

            prescriptionData.createdAt =
                now;

            await db.collection("prescriptions")
                .add(prescriptionData);

            M.toast({
                html:
                    "Prescrição adicionada com sucesso."
            });
        }


        /*
         * EDIT
         */

        else if (
            prescriptionModalMode === "edit"
        ) {

            if (!currentPrescription?.documentId) {

                throw new Error(
                    "ID da prescrição não encontrado."
                );
            }


            await db.collection("prescriptions")
                .doc(
                    currentPrescription.documentId
                )
                .update(
                    prescriptionData
                );


            M.toast({
                html:
                    "Prescrição atualizada com sucesso."
            });
        }


        /*
         * Close and refresh list.
         */

        prescriptionModalInstance.close();

        if (typeof loadPrescriptions === "function") {
            await loadPrescriptions();
        }


    } catch (error) {

        console.error(
            "Erro ao guardar prescrição:",
            error
        );

        M.toast({
            html:
                "Não foi possível guardar a prescrição."
        });

    } finally {

        btnSavePrescription.disabled = false;
    }
}

/*
 * ============================================================
 * EVENTS
 * ============================================================
 */


/*
 * STEP 1 → STEP 2
 */

prescriptionFormStep1.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        if (!validatePrescriptionStep1()) {
            return;
        }


        const exercise =
            getExerciseById(
                document.getElementById("prescription-exercise").value
            );


        if (!exercise) {

            M.toast({
                html:
                    "Exercício não encontrado."
            });

            return;
        }


        selectedExercise =
            exercise;


        renderPrescriptionFields(
            exercise.externalLoad
        );


        showPrescriptionStep(2);
    }
);


/*
 * STEP 2 → SAVE
 */

prescriptionFormStep2.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        savePrescription();
    }
);


/*
 * STEP 2 → STEP 1
 */

btnBackPrescription.addEventListener(
    "click",
    () => {

        if (
            prescriptionModalMode ===
            "view"
        ) {
            return;
        }

        showPrescriptionStep(1);
    }
);


/*
 * CANCEL / CLOSE
 */

btnCancelPrescription.addEventListener(
    "click",
    () => {

        prescriptionModalInstance.close();
    }
);


/*
 * ============================================================
 * INITIALIZE MATERIALIZE MODAL
 * ============================================================
 */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const modalElements =
            document.querySelectorAll(
                ".modal"
            );


        const instances =
            M.Modal.init(
                modalElements
            );


        prescriptionModalInstance =
            M.Modal.getInstance(
                prescriptionModal
            );


        /*
         * Add button from the toolbar.
         */

        const btnAddPrescription =
            document.getElementById(
                "btn-add-prescription"
            );


        if (btnAddPrescription) {

            btnAddPrescription.addEventListener(
                "click",
                () => {

                    openPrescriptionModal(
                        "add"
                    );

                }
            );
        }

    }
);
