export default async function copyTextToClipboard(text: string) {
    try {
        // focus from wallet window back to browser
        window.focus();
        // wait to finish focus
        await new Promise((resolve) => setTimeout(resolve, 500));
        // copy tx hash to clipboard
        await navigator.clipboard.writeText(text);
    } catch {
        // for metamask mobile android
        const input = document.createElement("input");
        input.type = "text";
        input.value = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        document.body.removeChild(input);
    }
}