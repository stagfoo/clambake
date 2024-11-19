import { Keyboard } from '@capacitor/keyboard';
import { actions } from '../domain';

export type KeyboardEvents = {
    keyboardWillHide: boolean
	keyboardDidHide: boolean
	keyboardWillShow: number
	keyboardDidShow: number
}

//TODO do i want a keyboard event bus?
Keyboard.addListener('keyboardWillShow', info => {
    actions.emit('keyboardWillShow', info.keyboardHeight)
});

Keyboard.addListener('keyboardDidShow', info => {
    actions.emit('keyboardDidShow', info.keyboardHeight);
});

Keyboard.addListener('keyboardWillHide', () => {
    actions.emit('keyboardWillHide', true);
});

Keyboard.addListener('keyboardDidHide', () => {
    actions.emit('keyboardDidHide', true);
});

