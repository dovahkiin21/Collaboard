const dashboard = document.querySelector("#dashboard-form")
console.log(dashboard)

function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const userid = getParameterByName('_uid')

dashboard.addEventListener("submit",async(e)=>{
    e.preventDefault()
    const name = dashboard.name.value
    console.log(name)
    
    location.assign('/dashboard/new?name='+name+'&_uid='+userid)

})