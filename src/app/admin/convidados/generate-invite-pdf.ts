import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'
import invitationImage from '~/assets/invitation.png'
// Posicionamento do QR code alinhado ao texto "Clique no QR Code para mais informações"
// Imagem de mockup nos assets (1080 x 1920): QR de ~212px centralizado horizontalmente em X=280 e acima do texto
const ORIGINAL_WIDTH = 1080
const ORIGINAL_HEIGHT = 1920

const PDF_WIDTH = 253
const PDF_HEIGHT = 450

const QR_ORIGINAL_SIZE = 212
const QR_ORIGINAL_LEFT = 174
const QR_ORIGINAL_TOP = 1520

const QR_SIZE_PT = (QR_ORIGINAL_SIZE / ORIGINAL_WIDTH) * PDF_WIDTH // ~49.7 pt
const QR_X_PT = (QR_ORIGINAL_LEFT / ORIGINAL_WIDTH) * PDF_WIDTH // ~40.8 pt
const QR_Y_PT = (QR_ORIGINAL_TOP / ORIGINAL_HEIGHT) * PDF_HEIGHT // ~356.2 pt

let cachedBackgroundBytes: Uint8Array | null = null

async function getBackgroundBytes(): Promise<Uint8Array> {
  if (cachedBackgroundBytes) {
    return cachedBackgroundBytes
  }

  const response = await fetch(invitationImage.src)
  const arrayBuffer = await response.arrayBuffer()
  cachedBackgroundBytes = new Uint8Array(arrayBuffer)
  return cachedBackgroundBytes
}

async function getQrCodeBytes(targetUrl: string): Promise<Uint8Array> {
  const qrDataUrl = await QRCode.toDataURL(targetUrl, {
    color: {
      dark: '#8B6914',
      light: '#00000000',
    },
    margin: 0,
    errorCorrectionLevel: 'M',
    width: 300,
  })

  const response = await fetch(qrDataUrl)
  const blob = await response.blob()
  const buffer = await blob.arrayBuffer()
  return new Uint8Array(buffer)
}

export async function generateInvitePdf(code: string): Promise<Blob> {
  const targetUrl = `https://casamento-ju-e-gu.com.br?code=${encodeURIComponent(code)}`

  const [bgBytes, qrBytes] = await Promise.all([
    getBackgroundBytes(),
    getQrCodeBytes(targetUrl),
  ])

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: [PDF_WIDTH, PDF_HEIGHT],
    compress: true,
  })

  // Add background image from bytes (PNG)
  doc.addImage(bgBytes, 'PNG', 0, 0, PDF_WIDTH, PDF_HEIGHT)

  // Add QR code from bytes (PNG)
  doc.addImage(qrBytes, 'PNG', QR_X_PT, QR_Y_PT, QR_SIZE_PT, QR_SIZE_PT)

  // Add clickable hyperlink matching the QR code area
  doc.link(QR_X_PT, QR_Y_PT, QR_SIZE_PT, QR_SIZE_PT, { url: targetUrl })

  return doc.output('blob')
}
