// Contenido de ejemplo de un archivo OPF en formato de cadena
const opfContent = `
<package xmlns="http://openebook.org/namespaces/oeb-package/1.0/">
  <metadata>
    <dc:title>Título del Libro</dc:title>
    <dc:creator>Nombre del Autor</dc:creator>
    <dc:language>es</dc:language>
  </metadata>
  <manifest>
    <item id="cover" href="cover.html" media-type="text/html" />
    <item id="chapter1" href="chapter1.html" media-type="text/html" />
  </manifest>
  <spine>
    <itemref idref="cover" />
    <itemref idref="chapter1" />
  </spine>
</package>
`;

// Crear un parser DOM para analizar el archivo OPF
const parser = new DOMParser();
const xmlDoc = parser.parseFromString(opfContent, 'application/xml');

// Extraer metadatos del libro
const title = xmlDoc.querySelector('dc\\:title').textContent;
const author = xmlDoc.querySelector('dc\\:creator').textContent;
const language = xmlDoc.querySelector('dc\\:language').textContent;

console.log('Título del Libro:', title);
console.log('Autor:', author);
console.log('Idioma:', language);

// Extraer información del manifiesto (lista de recursos)
const items = xmlDoc.querySelectorAll('manifest item');
console.log('Recursos en el Manifiesto:');
items.forEach(item => {
  const id = item.getAttribute('id');
  const href = item.getAttribute('href');
  const mediaType = item.getAttribute('media-type');
  console.log(`- ID: ${id}, HREF: ${href}, Tipo de Medio: ${mediaType}`);
});

// Extraer información de la columna vertebral (orden de lectura)
const itemrefs = xmlDoc.querySelectorAll('spine itemref');
console.log('Orden de Lectura (Columna Vertebral):');
itemrefs.forEach(itemref => {
  const idref = itemref.getAttribute('idref');
  console.log(`- ID de Referencia: ${idref}`);
});

// Obtener el contenedor HTML donde mostraremos la información del libro
const bookInfoContainer = document.getElementById('book-info');

// Crear elementos HTML para mostrar la información
const titleElement = document.createElement('h2');
titleElement.textContent = 'Título del Libro: ' + title;

const authorElement = document.createElement('p');
authorElement.textContent = 'Autor: ' + author;

const languageElement = document.createElement('p');
languageElement.textContent = 'Idioma: ' + language;

// Agregar los elementos al contenedor
bookInfoContainer.appendChild(titleElement);
bookInfoContainer.appendChild(authorElement);
bookInfoContainer.appendChild(languageElement);


// Obtener el contenedor HTML donde mostraremos la lista de libros
const bookListContainer = document.getElementById('book-list');

// Lista de nombres de archivos OPF (representando los libros)
const bookFiles = ['libro1.opf', 'libro2.opf', 'libro3.opf']; // Reemplaza con tus nombres de archivos reales

// Función para agregar un elemento de libro a la lista
function addBookToList(title, author) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<strong>${title}</strong> - ${author}`;
    bookListContainer.appendChild(listItem);
}

// Iterar sobre los archivos OPF y mostrar la lista de libros
bookFiles.forEach(bookFile => {
    // Crear un parser DOM para analizar el archivo OPF
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(opfContent, 'application/xml');

  // Extraer metadatos del libro
  const title = xmlDoc.querySelector('dc\\:title').textContent;
  const author = xmlDoc.querySelector('dc\\:creator').textContent;

    // Agregar el libro a la lista
    addBookToList(title, author);
});

const fileInput = document.getElementById('file-input');
        const fileContents = document.getElementById('file-contents');

        fileInput.addEventListener('change', function() {
            const selectedFile = fileInput.files[0];

            if (selectedFile) {
                const reader = new FileReader();

                reader.onload = function(event) {
                    const fileText = event.target.result;
                    fileContents.textContent = fileText;
                };

                reader.readAsText(selectedFile);
            } else {
                fileContents.textContent = 'Ningún archivo seleccionado';
            }
        });






