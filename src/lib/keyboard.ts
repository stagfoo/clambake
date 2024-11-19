import { Keyboard } from '@capacitor/keyboard';
import { eventbus } from '../domain';

export type KeyboardEvents = {
    keyboardWillHide: boolean
	keyboardDidHide: boolean
	keyboardWillShow: number
	keyboardDidShow: number
}

//TODO do i want a keyboard event bus?
Keyboard.addListener('keyboardWillShow', info => {
    eventbus.emit('keyboardWillShow', info.keyboardHeight)
});

Keyboard.addListener('keyboardDidShow', info => {
    eventbus.emit('keyboardDidShow', info.keyboardHeight);
});

Keyboard.addListener('keyboardWillHide', () => {
    eventbus.emit('keyboardWillHide', true);
});

Keyboard.addListener('keyboardDidHide', () => {
    eventbus.emit('keyboardDidHide', true);
});

