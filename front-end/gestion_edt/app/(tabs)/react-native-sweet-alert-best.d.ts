declare module 'react-native-sweet-alert-best' {
    const SweetAlert: {
      showAlertWithOptions: (options: {
        title: string;
        subTitle?: string;
        style?: 'success' | 'error' | 'warning' | 'info';
        cancellable?: boolean;
        onConfirm?: () => void;
        onCancel?: () => void;
      }) => void;
    };
    export default SweetAlert;
  }
  