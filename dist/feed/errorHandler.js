import { error_headline } from './vars';
export var displayError = function (message, container) {
    container.setAttribute('data-error', error_headline + message);
};
