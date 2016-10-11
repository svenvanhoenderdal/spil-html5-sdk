module.exports = function(url, callback) {
    var head = document.getElementsByTagName('head')[0],
        script = document.createElement('script');
    script.src = url;

    script.onreadystatechange = callback;
    script.onload = callback;

    head.appendChild(script);
};