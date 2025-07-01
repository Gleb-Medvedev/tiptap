import { useEffect, useState, type FC } from 'react';
import './Modal.css';

interface ModalProps {
    onClose: () => void;
}

const Modal: FC<ModalProps> = ({onClose}) => {
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

      switch(msg.event) {
        case 'init':
            const iframe = document.getElementById('drawio-iframe') as HTMLIFrameElement;
            iframe.contentWindow?.postMessage(
            JSON.stringify({
                action: 'load',
                xml: '<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel>',
            }),
            '*'
            );
            break;
        case 'save':
            const xml = msg.xml;
            console.log(xml);
            break;
        case 'exit':
            onClose();
            break;
        default:
            break;
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
