// Configuração - altere aqui para a sua chave PIX real
const CHAVE_PIX = "jvleonel1@gmail.com";

// elementos do DOM
const modalOverlay = document.getElementById('pixModal');
const modalTitulo = document.getElementById('modalTitulo');
const modalValor = document.getElementById('modalValor');
const pixChaveEl = document.getElementById('pixChave');
const qrcodeContainer = document.getElementById('qrcode');

let currentQR = null;

/* ------------------------------------------------------------------
   Helpers para gerar payload EMV/PIX válido
-------------------------------------------------------------------*/

// função para montar campo EMV (id + len + valor)
function emvField(id, value) {
  const v = String(value ?? '');
  const len = String(v.length).padStart(2, '0');
  return id + len + v;
}

// calcula CRC16/CCITT-FALSE (necessário para o PIX)
function crc16_ccitt_false(input) {
  let crc = 0xFFFF;
  for (let i = 0; i < input.length; i++) {
    crc ^= input.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

// gera payload PIX EMV válido
function gerarPayloadPIX(chavePix, descricao, valor, merchantName = 'CASAL', merchantCity = 'SAO PAULO') {
  let payload = '';

  // 00 - Payload Format Indicator
  payload += emvField('00', '01');

  // 26 - Merchant Account Info
  let mai = '';
  mai += emvField('00', 'br.gov.bcb.pix');
  mai += emvField('01', chavePix);
  if (descricao) mai += emvField('02', descricao.substring(0, 99));
  payload += emvField('26', mai);

  // 52 - Merchant Category Code
  payload += emvField('52', '0000');

  // 53 - Transaction Currency (986 = BRL)
  payload += emvField('53', '986');

  // 54 - Transaction Amount
  if (valor && !isNaN(valor)) payload += emvField('54', Number(valor).toFixed(2));

  // 58 - Country Code
  payload += emvField('58', 'BR');

  // 59 - Merchant Name
  payload += emvField('59', merchantName.substring(0, 25));

  // 60 - Merchant City
  payload += emvField('60', merchantCity.substring(0, 15));

  // 62 - Additional Data Field Template (txid)
  const txid = 'TX' + Math.random().toString(36).slice(2, 10).toUpperCase();
  const addData = emvField('05', txid);
  payload += emvField('62', addData);

  // 63 - CRC
  const payloadForCrc = payload + '6304';
  const crc = crc16_ccitt_false(payloadForCrc);
  payload += emvField('63', crc);

  return payload;
}

/* ------------------------------------------------------------------
   Funções principais
-------------------------------------------------------------------*/

// abrir modal e gerar QR PIX
function abrirModal(nomePresente, valor) {
  // preencher textos
  modalTitulo.innerText = `Presentear: ${nomePresente}`;
  modalValor.innerText = `Valor: R$ ${valor.toFixed(2)}`;
  pixChaveEl.innerText = CHAVE_PIX;

  // limpar QR antigo
  qrcodeContainer.innerHTML = '';

  // gerar payload PIX EMV válido
  const payload = gerarPayloadPIX(CHAVE_PIX, nomePresente, valor);

  // gerar QR Code
  try {
    currentQR = new QRCode(qrcodeContainer, {
      text: payload,
      width: 220,
      height: 220,
      correctLevel: QRCode.CorrectLevel.H
    });
  } catch (err) {
    console.error('Erro ao gerar QRCode:', err);
    const pre = document.createElement('pre');
    pre.textContent = payload;
    qrcodeContainer.appendChild(pre);
  }

  // mostrar modal
  modalOverlay.classList.add('show');
  modalOverlay.setAttribute('aria-hidden', 'false');
}

// fechar modal
function fecharModal() {
  modalOverlay.classList.remove('show');
  modalOverlay.setAttribute('aria-hidden', 'true');
  qrcodeContainer.innerHTML = '';
  currentQR = null;
}

// clicar fora do modal fecha
modalOverlay.addEventListener('click', function (e) {
  if (e.target === modalOverlay) fecharModal();
});

// copiar chave PIX
function copiarChave() {
  if (!navigator.clipboard) {
    const ta = document.createElement('textarea');
    ta.value = CHAVE_PIX;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    alert('Chave PIX copiada!');
    return;
  }
  navigator.clipboard.writeText(CHAVE_PIX)
    .then(() => alert('Chave PIX copiada!'))
    .catch(() => alert('Não foi possível copiar automaticamente. Copie manualmente: ' + CHAVE_PIX));
}
