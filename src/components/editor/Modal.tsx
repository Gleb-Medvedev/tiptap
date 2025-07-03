import { useEffect, useState, type FC } from 'react';
import './Modal.css';

interface ModalProps {
    onClose: () => void;
    insertDrawioContentOnSave?: (dataUrl: string) => void;
}

const Modal: FC<ModalProps> = ({onClose, insertDrawioContentOnSave}) => {
    const [isModalLoad, setIsModalLoad] = useState<boolean>(false);

useEffect(() => {
  const iframe = document.getElementById('drawio-iframe') as HTMLIFrameElement;

  const handleLoad = () => {
    iframe.contentWindow?.postMessage(
      JSON.stringify({
        action: 'load',
        xml: '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel>',
      }),
      '*'
    );
  };

  iframe.addEventListener('load', handleLoad);

  return () => {
    iframe.removeEventListener('load', handleLoad);
  };
}, []);

useEffect(() => {
  const receiveMessage = (event: MessageEvent) => {
    if (typeof event.data !== 'string') return 
      const msg = JSON.parse(event.data);

      const iframe = document.getElementById('drawio-iframe') as HTMLIFrameElement;

      switch(msg.event) {
        case 'init':
            // const iframe = document.getElementById('drawio-iframe') as HTMLIFrameElement;
            iframe.contentWindow?.postMessage(
            JSON.stringify({
                action: 'load',
                xml: '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel>',
            }),
            '*'
            );
            break;
        // case 'save':
        //     const xml = msg.xml;
        //     // console.log(xml);
        //     break;
        

        case 'save': {
          const xml = msg.xml;

          // Отправляем команду на экспорт изображения
          const iframe = document.getElementById('drawio-iframe') as HTMLIFrameElement;
          iframe.contentWindow?.postMessage(
            JSON.stringify({
              action: 'export',
              format: 'png',
              xml: xml,
              spin: 'Экспорт...',
            }),
            '*'
          );

          break;
        };

        case 'export': {
          const dataUrl = msg.data; // data:image/png;base64,...
          if (dataUrl) {
            insertDrawioContentOnSave?.(dataUrl); // 👈 передаём наружу
            onClose();         // закрываем модалку
          }
          break;
        }


        case 'exit':
            onClose();
            break;
        // case 'export':
        //   iframe.contentWindow?.postMessage(
        //   JSON.stringify({
        //     action: 'export',
        //     format: 'png', // или 'svg'
        //     xml: msg.xml,  // можно не передавать, если уже открыта диаграмма
        //     spin: 'Exporting...',
        //   }),
        //   '*'
        // );
        // break;

        default:
            console.log(msg.event);
    }
  };

  window.addEventListener('message', receiveMessage);

  return () => {
    window.removeEventListener('message', receiveMessage);
  };
}, []);

  return (  
    <div>
        <div className={`loader ${isModalLoad ? 'visible' : ''}`}>ЗАГРУЗКА</div>
        <iframe
            src="https://embed.diagrams.net/?embed=1&proto=json"
            id="drawio-iframe"
            style={{ width: '100%', height: '100%', border: 'none', position: 'fixed', inset: 0, zIndex: 999 }}
            onLoad={() => setIsModalLoad(true)}
        />
    </div>
  );
}

export default Modal;
