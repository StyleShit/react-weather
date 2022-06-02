import { useState, useCallback } from 'react';

export const useToasts = () => {
	const [ toasts, setToasts ] = useState( [] );

	const showToast = useCallback( ( type, text ) => {
		setToasts( ( prev ) => (
			[ ...prev, { type, text } ]
		) );
	}, [] );

	return {
		toasts,
		showToast,
	};
};
