export type Message = {
	type: MessageType;
	title: string;
	subtitle: string;
};

export enum MessageType {
	ERROR = 'error',
	WARNING = 'warning',
	INFO = 'info',
	SUCCESS = 'success'
}
