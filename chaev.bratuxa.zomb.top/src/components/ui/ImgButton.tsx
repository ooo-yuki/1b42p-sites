// Единая кнопка с картинкой: все хилки/пойло/артефакты выглядят одинаково.
import type { CSSProperties, ReactNode } from 'react';

interface ImgButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  img?: string;
  imgAlt?: string;
  imgSize?: number;
  style?: CSSProperties;
}

export default function ImgButton({ children, onClick, disabled, img, imgAlt, imgSize, style }: ImgButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} style={style}>
      {img && (
        <img
          src={img}
          alt={imgAlt ?? ''}
          style={{ height: imgSize ?? 30, verticalAlign: 'middle', borderRadius: 8, marginRight: 8 }}
        />
      )}
      {children}
    </button>
  );
}
