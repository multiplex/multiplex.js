/**
* Throws a user-defined exception with the specified message.
* @param {String} msg Human-readable description of the error.
*/
export default function error(msg) {
    throw new Error(msg);
}
