function writeToTextarea(textareaId: string, appendContent: string) {
  const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;

  if (textarea) {
    textarea.value += appendContent;
    textarea.scrollTop = textarea.scrollHeight;
  }
}

export default writeToTextarea;
