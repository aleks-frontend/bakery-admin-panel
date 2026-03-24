import { Document, Page, StyleSheet, Text, View, pdf } from "@react-pdf/renderer"
import type { Order } from "@/types/order"
import { registerReceiptFonts } from "@/components/OrderReceiptPdf"

export type PackageStickersPdfLabels = {
  rsd: string
}

const FONT = "NotoSans"

/** PDF points per centimetre (72 pt per inch, 2.54 cm per inch). */
const PT_PER_CM = 72 / 2.54

/** ~5 cm × ~2.5 cm sticker cells (cut guides). */
const CELL_W = 5 * PT_PER_CM
const CELL_H = 2.5 * PT_PER_CM

/** A4 portrait, pt (PDF standard). */
const A4_W = 595.28
const A4_H = 841.89

const PAGE_MARGIN = 12

function gridDimensions() {
  const innerW = A4_W - 2 * PAGE_MARGIN
  const innerH = A4_H - 2 * PAGE_MARGIN
  const cols = Math.max(1, Math.floor(innerW / CELL_W))
  const rows = Math.max(1, Math.floor(innerH / CELL_H))
  const gridW = cols * CELL_W
  const gridH = rows * CELL_H
  const offsetX = PAGE_MARGIN + (innerW - gridW) / 2
  const offsetY = PAGE_MARGIN + (innerH - gridH) / 2
  return { cols, rows, gridW, gridH, offsetX, offsetY, perPage: cols * rows }
}

const styles = StyleSheet.create({
  page: {
    fontFamily: FONT,
    color: "#111827",
  },
  pageInner: {
    width: A4_W,
    height: A4_H,
  },
  row: {
    flexDirection: "row",
  },
  cell: {
    width: CELL_W,
    height: CELL_H,
    borderWidth: 0.5,
    borderColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  cellText: {
    fontFamily: FONT,
    fontSize: 8,
    fontWeight: 700,
    textAlign: "center",
    maxWidth: CELL_W - 8,
  },
  cellPrice: {
    fontFamily: FONT,
    fontSize: 8,
    fontWeight: 700,
    textAlign: "center",
    marginTop: 2,
    maxWidth: CELL_W - 8,
  },
})

function formatPrice(n: number, rsd: string): string {
  return `${n.toLocaleString("sr-Latn-RS")} ${rsd}`
}

function formatFilenameDate(value: Date): string {
  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, "0")
  const day = String(value.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

/** Split orders into pages of at most `perPage` cells; preserve selection order. */
function chunkOrdersForPages(orders: Order[], perPage: number): Order[][] {
  const pages: Order[][] = []
  for (let i = 0; i < orders.length; i += perPage) {
    pages.push(orders.slice(i, i + perPage))
  }
  return pages
}

function StickerCell({
  order,
  labels,
}: {
  order: Order | null
  labels: PackageStickersPdfLabels
}) {
  if (!order) {
    return <View style={styles.cell} />
  }
  return (
    <View style={styles.cell}>
      <Text style={styles.cellText}>{order.recipient}</Text>
      <Text style={styles.cellPrice}>
        {formatPrice(order.totalPrice, labels.rsd)}
      </Text>
    </View>
  )
}

export function PackageStickersDocument({
  orders,
  labels,
}: {
  orders: Order[]
  labels: PackageStickersPdfLabels
}) {
  const { cols, rows, offsetX, offsetY, perPage } = gridDimensions()
  const pages = chunkOrdersForPages(orders, perPage)

  return (
    <Document>
      {pages.map((pageOrders, pageIndex) => (
        <Page key={pageIndex} size="A4" style={styles.page}>
          <View
            style={[
              styles.pageInner,
              { paddingLeft: offsetX, paddingTop: offsetY },
            ]}
          >
            {Array.from({ length: rows }, (_, r) => (
              <View key={r} style={styles.row}>
                {Array.from({ length: cols }, (_, c) => {
                  const idx = r * cols + c
                  const order = pageOrders[idx] ?? null
                  return (
                    <StickerCell
                      key={`${r}-${c}`}
                      order={order}
                      labels={labels}
                    />
                  )
                })}
              </View>
            ))}
          </View>
        </Page>
      ))}
    </Document>
  )
}

export async function downloadPackageStickersPdf(
  orders: Order[],
  labels: PackageStickersPdfLabels,
): Promise<void> {
  if (!orders.length) return
  registerReceiptFonts()
  const blob = await pdf(
    <PackageStickersDocument orders={orders} labels={labels} />,
  ).toBlob()

  const filename = `package-stickers-${formatFilenameDate(new Date())}.pdf`
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.rel = "noopener"
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
