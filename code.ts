function main() {
	const selection = figma.currentPage.selection

	if (selection.length !== 1 || selection[0].type !== "FRAME") {
		figma.notify("Selecione apenas o frame que contém a imagem")
		figma.closePlugin()
		return
	}

	const frame = selection[0] as FrameNode

	const image = frame.children.find(
		node => node.type === "RECTANGLE" || node.type === "FRAME"
	) as SceneNode & LayoutMixin

	if (!image) {
		figma.notify("Não encontrei imagem dentro do frame")
		figma.closePlugin()
		return
	}

	const frameRatio = frame.width / frame.height
	const imageRatio = image.width / image.height

	let newWidth: number
	let newHeight: number

	if (imageRatio > frameRatio) {
		newHeight = frame.height
		newWidth = frame.height * imageRatio
	} else {
		newWidth = frame.width
		newHeight = frame.width / imageRatio
	}

	image.resize(newWidth, newHeight)
	image.x = (frame.width - newWidth) / 2
	image.y = (frame.height - newHeight) / 2

	frame.clipsContent = true

	figma.notify("Cover aplicado")
	figma.closePlugin()
}

main()
