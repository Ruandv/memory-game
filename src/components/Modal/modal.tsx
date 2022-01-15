import React, { useState, useEffect } from 'react';

import Styles from './modal.module.scss';

function Modal (props: any) {
  const { message, heading, actionButtons: actionsButtonText, onClose }: IModalProps = props;
  const [canShow, SetCanShow] = useState(props.display);
  useEffect(() => {
    SetCanShow(props.display);
  }, [props.display]);
  if (!canShow) {
    return null;
  }
  return (
    <div
      onClick={() => {
        onClose.onClick();
      }}
      className={Styles.modalContainer}
    >
      <div className={Styles.modal}>
        <header>
          <div className={Styles.headerText}>{heading}</div>
          <div
            className={`${Styles.btn} ${Styles.btnClose}`}
            onClick={() => {
              onClose.onClick();
            }}
          >
            {onClose.text}
          </div>
        </header>
        <div className={Styles.content}>{message}</div>
        <footer>
          {actionsButtonText.map((b) => {
            return (
              <div
                onClick={b.onClick}
                key={actionsButtonText.indexOf(b)}
                className={`${Styles.btn} ${b.isDefault === true ? Styles.selected : ''}`}

              >
                {b.text}
              </div>
            );
          })}
        </footer>
      </div>
    </div>
  );
}

export default Modal;

export interface IModalProps {
  heading: string;
  message: string;
  onClose: IButton;
  actionButtons: IButton[];
  display: boolean;
}

export interface IButton {
  text: string;
  onClick: () => void;
  isDefault?: boolean;
}
