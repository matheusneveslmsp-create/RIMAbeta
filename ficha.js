function getQueryParam(name) {
 const url = new URL(window.location.href);
 return url.searchParams.get(name);
}

document.addEventListener('DOMContentLoaded', () => {
 const id = parseInt(getQueryParam('id'));

 if (isNaN(id) || !window.catalogoTCCs || !window.catalogoTCCs[id]) {
  document.querySelector(".ficha-container").innerHTML = "<p>TCC não encontrado. <a href='index.html'>Voltar</a></p>";
  return;
 }

  const item = window.catalogoTCCs[id];

document.getElementById("titulo").textContent = item.titulo || "—";
document.getElementById("trabalho").textContent = item.trabalho || "—";
document.getElementById("descricao").textContent = item.descricao || "—"; document.getElementById("autor").textContent = item.autor || "—";
document.getElementById("ano").textContent = item.ano || "—";
document.getElementById("orientador").textContent = item.orientador || "—";

// **Esta linha agora funciona corretamente:**
document.getElementById("palavraschave").textContent = item.palavraschave || "—"; 

// Link do PDF
 const pdfLinkElement = document.getElementById("pdfLink");
 
 // **Ajuste para ocultar a linha inteira (a tag <p>) se não houver PDF**
 const pdfContainer = pdfLinkElement ? pdfLinkElement.parentElement : null;

 if (pdfLinkElement && item.arquivo) {
 pdfLinkElement.href = item.arquivo;
 } else if (pdfContainer) {
  pdfContainer.style.display = "none"; // Oculta a linha <p>
 }
});