import { Keyboard } from '@capacitor/keyboard';
import { ACTIONS } from '../domain';

export type KeyboardEvents = {
    keyboardWillHide: boolean
	keyboardDidHide: boolean
	keyboardWillShow: number
	keyboardDidShow: number
}

//TODO do i want a keyboard event bus?
Keyboard.addListener('keyboardWillShow', info => {
    ACTIONS.emit('keyboardWillShow', info.keyboardHeight)
});

Keyboard.addListener('keyboardDidShow', info => {
    ACTIONS.emit('keyboardDidShow', info.keyboardHeight);
});

Keyboard.addListener('keyboardWillHide', () => {
    ACTIONS.emit('keyboardWillHide', true);
});

Keyboard.addListener('keyboardDidHide', () => {
    ACTIONS.emit('keyboardDidHide', true);
});

