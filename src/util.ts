export function random(len: number) {
    let options="qwertyuiopasdfghjklzxcvbnm1234567890";
    let length = options.length;
    let ans= "";

    for( let i=0; i<len; i++ ) {
        ans += options.charAt(Math.floor(Math.random() * length));
    }

    return ans;
}