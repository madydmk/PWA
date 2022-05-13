async function load(){
    const postsContainer = document.getElementById('posts');
    const spinner = loader();
    postsContainer.appendChild(spinner)

    try{
        const posts = await fetch("/posts.json").then((d)=>d.json())
        for(const post of posts){
            postsContainer.appendChild(generatePost(post));
        }
    }catch{
        const errorElement = error()
        postsContainer.appendChild(errorElement)
        const reload = (e)=>{
            window.removeEventListener("online", reload);
            e.preventDefault();
            errorElement.remove()
        }
        window.addEventListener("online", reload)
        errorElement.querySelector(".js-reload").addEventListener("click", reload)
    }
    spinner.remove()
}
function error(){
    const div = document.createElement("div")
    div.appendChild(document.importNode(document.getElementById("loader").content, true))
    return div
}