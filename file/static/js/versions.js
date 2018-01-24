
function GetVersions(arr) {
    var dom, attr, i;
    dom = document, attr = get_versions();
    i = 0
    for (i; i < arr.length; i++) {
        var script = dom.createElement('script')
        script.type = 'text/javascript'
        script.src = arr[i].src + "?v=" + attr
        if (arr[i].class) {
            script.className += arr[i].class
        }
        dom.body.appendChild(script)
    }


    //for (var i = 0; i < arr.length; i++)
    //{
    //   $.getScript(arr[i].src + "?v=" + get_versions());  //¼ÓÔØjsÎÄ¼þ
    //}
}

function get_versions() {
    return getNowFormatDatezz();  //document.getElementById('container').getAttribute('data-versions')
}
