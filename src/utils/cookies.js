export const setItem =  (name, value, days) => {
    var d = new Date;
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
    window.document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
}
export const getItem =  (name) => {
    var v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
}
export const deleteItem =  (name) => {
    setItem(name, '', -1);
}