import React, { useRef, useEffect, useState } from 'react';
import { CollageItem, CollageSettings } from './collageUtils';
import { toast } from 'sonner';
import { useDrag } from "@use-gesture/react";
import { useSpring, animated } from "@react-spring/web";

interface CollageCanvasProps {
  items: CollageItem[];
  settings: CollageSettings;
  selectedItemId: string | null;
  onSelectItem: (id: string | null) => void;
  onMoveItem: (id: string, x: number, y: number) => void;
  canvasWidth: number;
  canvasHeight: number;
}

const CollageCanvas: React.FC<CollageCanvasProps> = ({
  items,
  settings,
  selectedItemId,
  onSelectItem,
  onMoveItem,
  canvasWidth,
  canvasHeight
}) => {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newLoadedImages: Record<string, boolean> = {};
    items.forEach(item => {
      newLoadedImages[item.id] = loadedImages[item.id] || false;
    });
    setLoadedImages(newLoadedImages);
  }, [items]);

  const handleImageLoad = (itemId: string) => {
    setLoadedImages(prev => ({ ...prev, [itemId]: true }));
  };

  return (
    <div
      ref={canvasRef}
      className="relative overflow-hidden bg-white shadow-lg"
      style={{ width: canvasWidth, height: canvasHeight, backgroundColor: settings.backgroundColor }}
      onClick={(e) => { if (e.target === canvasRef.current) onSelectItem(null); }}
    >
      {items.map((item) => (
        <DraggableImage
          key={item.id}
          item={item}
          isSelected={selectedItemId === item.id}
          onMoveItem={onMoveItem}
          onSelectItem={onSelectItem}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
          onLoad={() => handleImageLoad(item.id)}
          loaded={loadedImages[item.id]}
        />
      ))}
    </div>
  );
};

const DraggableImage = ({ item, isSelected, onMoveItem, onSelectItem, canvasWidth, canvasHeight, onLoad, loaded }) => {
  const [{ x, y }, api] = useSpring(() => ({ x: item.x, y: item.y }), [item.x, item.y]);

  const bind = useDrag(({ offset: [ox, oy] }) => {
    api.start({ x: ox, y: oy });
    onMoveItem(item.id, ox, oy);
  }, {
    bounds: { left: 0, right: canvasWidth - item.width, top: 0, bottom: canvasHeight - item.height }
  });

  return (
    <animated.div
      {...bind()}
      className={`absolute ${isSelected ? "ring-2 ring-blue-500" : ""}`}
      style={{ x, y, width: item.width, height: item.height }}
      onMouseDown={() => onSelectItem(item.id)}
    >
      {!loaded && (
        <div className="w-full h-full flex items-center justify-center bg-muted animate-pulse">
          <div className="text-xs text-muted-foreground">Loading...</div>
        </div>
      )}
      <img
        src={item.src}
        alt="Collage item"
        className="w-full h-full object-cover"
        style={{ opacity: loaded ? 1 : 0, maxWidth: canvasWidth }}
        onLoad={onLoad}
        onError={() => {
          toast.error(`Failed to load image ${item.id}`);
        }}
      />
    </animated.div>
  );
};

export default CollageCanvas;
