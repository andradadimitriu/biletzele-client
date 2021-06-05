export const getByTextContent = (text) => (content, node) => {
    const hasText = (node) => node.textContent.includes(text);
    const nodeHasText = hasText(node);
    const childrenDontHaveText = Array.from(node.children).every(
        (child) => !hasText(child)
    );

    return nodeHasText && childrenDontHaveText;
};