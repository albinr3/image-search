//variables

const form = document.querySelector("#formulario");
const result = document.querySelector("#resultado");
const pagination = document.querySelector("#paginacion");

const word = document.querySelector("#termino");
const searchBtn = document.querySelector("#btn");

const imagesPerPage = 40;
let pagesTotal;
let iterator;
let actualPage = 1;


window.onload = () => {
    form.addEventListener("submit", validation);

};

function validation(e) {
    e.preventDefault();

    if(word.value === "") {
        showAlert("You need to write something to search!");
        return;
    }

    searchImage(word.value);
}

function showAlert(message) {

    //validation
    const alertExist = document.querySelector(".alert");

    if(!alertExist) {
        const alert = document.createElement("div");
        alert.classList.add("bg-red-300", "border-red-400", "text-red-800", "px-4", "py-3",
        "rounded", "max-w-md", "mx-auto", "mt-6", "text-center", "alert");

        alert.innerHTML = `
        <strong class="font-bold">ERROR!</strong>
        <span class="block">${message}</span>
        `;
        form.appendChild(alert);

        //delete alert after 4 sec
        setTimeout( () => alert.remove(), 4000);
    }
}

async function searchImage(word) {
    const key = "14258319-b0a1e6f9151944a09d2cea303m";
    const url = `https://pixabay.com/api/?key=${key}&q=${word}&image_type=photo&pretty=true&per_page=${imagesPerPage}&page=${actualPage}`;

    try {
        const response = await fetch(url);
        const result = await response.json();

        pagesTotal = calcPages(result.totalHits)

        //check if there is not results
        if(pagesTotal === 0) {
            showAlert("There is not images with that name!");
            return;
        }
        
        showHtml(result.hits);

    } catch (error) {
        console.log(error);
    }
    
}

function showHtml(imageArray) {
    
    clearHtml(result);

    //iterate over the picture array
    imageArray.forEach(image => {
        const { previewURL, likes, views, largeImageURL} = image;

        result.innerHTML += `
        <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
            <div class="bg-white">
                <a href="${largeImageURL}" target="_blank" rel="noopener noreferrer"><img class="w-full" src="${previewURL}"></a>

                <div class="p-4" id="div-info">
                    
                    <p class="font-bold"> ${likes} <span class="font-light">Likes</span> </p>
                    <p class="font-bold"> ${views} <span class="font-light">Views</span> </p>

                    <a class="block w-full bg-blue-800 hover:bg-blue text-white uppercase font-bold rounded mt-5 p-1" href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
                    Watch full Image
                    </a>
                </div>
            </div>
        </div>
        `
    })

    //we clear the previus pagination
    clearHtml(pagination);

    //we create the new paginator html
    printPaginator();
}

function clearHtml(div) {
    while(div.firstChild) {
        div.removeChild(div.firstChild);
    };
}

function calcPages(total) {
    return Math.ceil(total/imagesPerPage)
}

//generator it is going to register the quantity of elements depending of the pages

function *createPaginator(total) {
    for(let i=1; i<=total; i++) {
        yield i;
    }

}


function printPaginator() {
    iterator = createPaginator(pagesTotal);
    while(true) {
        const {value, done} = iterator.next();
        if(done) {
            return;
        } else {
            //create a botton for each element in the generator
            const botton = document.createElement("a");
            botton.href = "#";
            botton.textContent = value;
            botton.dataset.page = value;
            botton.classList.add("siguiente", "bg-yellow-400", "px-4", "mb-4", "py-1", "mr-2", "font-bold", "md-10", "rounded");
            botton.onclick = () => {
                actualPage = value;
                searchImage(word.value);
            }

            pagination.appendChild(botton);
        }
    }
}


// function *range(start, end) {
//     for (let i = start; i <= end; i++) {
//         yield i;
//     }
// }