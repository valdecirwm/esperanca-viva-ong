


// Input Masks
function maskCPF(input) {
    let v = input.value.replace(/\D/g, "");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d)/, "$1.$2");
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    input.value = v;
    validateField(input);
}

function maskPhone(input) {
    let v = input.value.replace(/\D/g, "");
    v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
    v = v.replace(/(\d)(\d{4})$/, "$1-$2");
    input.value = v;
    validateField(input);
}

function maskCEP(input) {
    let v = input.value.replace(/\D/g, "");
    v = v.replace(/^(\d{5})(\d)/, "$1-$2");
    input.value = v;
    validateField(input);
}

// Fetch Address via ViaCEP
async function fetchAddress() {
    const cepInput = document.getElementById('cep');
    const cep = cepInput.value.replace(/\D/g, '');

    if (cep.length === 8) {
        try {
            // Show loading state
            cepInput.classList.add('is-loading'); // could add a spinner class

            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (!data.erro) {
                document.getElementById('endereco').value = `${data.logradouro}, Bairro ${data.bairro}`;
                document.getElementById('cidade').value = data.localidade;
                document.getElementById('estado').value = data.uf;

                // Validate filled fields
                validateField(document.getElementById('endereco'));
                validateField(document.getElementById('cidade'));
                validateField(document.getElementById('estado'));
            } else {
                showToast('CEP não encontrado.', 'danger');
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            showToast('Erro ao consultar o CEP.', 'danger');
        } finally {
            cepInput.classList.remove('is-loading');
        }
    }
}

// Form Validation Logic
function validateField(field) {
    if (field.checkValidity()) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
    }
}

// Attach validation to inputs on blur/input
document.querySelectorAll('#volunteerForm input, #volunteerForm select, #volunteerForm textarea').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    if (input.tagName === 'SELECT') {
        input.addEventListener('change', () => validateField(input));
    }
});

// Form Submit Handler
document.getElementById('volunteerForm').addEventListener('submit', function (event) {
    event.preventDefault();

    let isValid = true;
    const form = event.target;

    // HTML5 Validation check
    if (!form.checkValidity()) {
        isValid = false;
    }

    // Custom Radio validation (since required on radio groups can be tricky visually)
    const radios = document.getElementsByName('disponibilidade');
    let radioChecked = false;
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            radioChecked = true;
            break;
        }
    }
    if (!radioChecked) {
        isValid = false;
        document.getElementById('radio-feedback').style.display = 'block';
        document.getElementById('radio-feedback').style.color = '#dc3545';
    } else {
        document.getElementById('radio-feedback').style.display = 'none';
    }

    // Visually mark invalid fields
    Array.from(form.elements).forEach(element => {
        if (element.tagName !== 'BUTTON' && element.tagName !== 'FIELDSET' && element.type !== 'radio' && element.type !== 'checkbox') {
            validateField(element);
        }
    });

    if (isValid) {
        // Simulate form submission
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';
        btn.disabled = true;

        setTimeout(() => {
            showToast('Cadastro realizado com sucesso! Em breve entraremos em contato.', 'success');
            form.reset();
            // Clear validation classes
            document.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
                el.classList.remove('is-valid', 'is-invalid');
            });
            btn.innerHTML = originalText;
            btn.disabled = false;
            window.scrollTo(0, 0);
        }, 1500);
    } else {
        showToast('Por favor, preencha todos os campos obrigatórios corretamente.', 'warning');
        // Scroll to first invalid element
        const firstInvalid = document.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
});

// Utility Functions
function copyToClipboard(text) {
    // Fallback approach compatible with iframes usually
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showToast('Chave PIX copiada para a área de transferência!', 'success');
        } else {
            showToast('Não foi possível copiar. Tente selecionar o texto.', 'warning');
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

// Custom Toast Notification System
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');

    // Bootstrap colors map
    const bgClass = {
        'success': 'bg-success text-white',
        'danger': 'bg-danger text-white',
        'warning': 'bg-warning text-dark',
        'info': 'bg-info text-dark'
    }[type];

    const iconClass = {
        'success': 'fa-check-circle',
        'danger': 'fa-exclamation-circle',
        'warning': 'fa-triangle-exclamation',
        'info': 'fa-info-circle'
    }[type];

    const toastId = 'toast-' + Date.now();

    const toastHTML = `
                <div id="${toastId}" class="toast align-items-center ${bgClass} border-0 mb-2 animate__animated animate__fadeInRight" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="d-flex">
                        <div class="toast-body">
                            <i class="fa-solid ${iconClass} me-2"></i> ${message}
                        </div>
                        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
            `;

    container.insertAdjacentHTML('beforeend', toastHTML);

    const toastElement = document.getElementById(toastId);
    const bsToast = new bootstrap.Toast(toastElement, { delay: 4000 });
    bsToast.show();

    // Remove from DOM after hidden
    toastElement.addEventListener('hidden.bs.toast', function () {
        toastElement.remove();
    });
}