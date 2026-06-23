function main() {
	const selection = figma.currentPage.selection

	if (selection.length !== 1 || selection[0].type !== "FRAME") {
		figma.notify("Selecione apenas o frame que contem as imagens")
		figma.closePlugin()
		return
	}

	const frame = selection[0] as FrameNode
	const images = frame.children.filter(isImageNode)

	if (images.length === 0) {
		figma.notify("Nao encontrei imagens dentro do frame")
		figma.closePlugin()
		return
	}

	const frameRatio = frame.width / frame.height

	for (const image of images) {
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
	}

	frame.clipsContent = true

	figma.notify(`Cover aplicado em ${images.length} imagem${images.length === 1 ? "" : "s"}`)
	figma.closePlugin()
}

function isImageNode(node: SceneNode): node is (RectangleNode | FrameNode) & LayoutMixin {
	if (node.type !== "RECTANGLE" && node.type !== "FRAME") {
		return false
	}

	return Array.isArray(node.fills) && node.fills.some(fill => fill.type === "IMAGE")
}

main()
