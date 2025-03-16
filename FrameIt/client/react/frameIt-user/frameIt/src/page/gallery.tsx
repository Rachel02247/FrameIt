import * as React from 'react';





import { Box, IconButton, ImageList, ImageListItem, ImageListItemBar, Modal } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import { useState } from 'react';

// eslint-disable-next-line react-refresh/only-export-components
export default() =>{
//
    const [selectedImage, setSelectedImage] = useState(null);

    const handleOpen = (img:any) => {
      setSelectedImage(img);
    };
  
    const handleClose = () => {
      setSelectedImage(null);
    };
    //
    const itemData = [
        {
          img: 'https://images.unsplash.com/photo-1549388604-817d15aa0110',
          title: 'Bed',
        },
        {
          img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
          title: 'Kitchen',
        },
        {
          img: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6',
          title: 'Sink',
        },
        {
          img: 'https://images.unsplash.com/photo-1525097487452-6278ff080c31',
          title: 'Books',
        },
        {
          img: 'https://images.unsplash.com/photo-1574180045827-681f8a1a9622',
          title: 'Chairs',
        },
        {
          img: 'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62',
          title: 'Candle',
        },
        {
          img: 'https://images.unsplash.com/photo-1530731141654-5993c3016c77',
          title: 'Laptop',
        },
        {
          img: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61',
          title: 'Doors',
        },
        {
          img: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
          title: 'Coffee',
        },
        {
          img: 'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee',
          title: 'Storage',
        },
        {
          img: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
          title: 'Coffee table',
        },
        {
          img: 'https://images.unsplash.com/photo-1588436706487-9d55d73a39e3',
          title: 'Blinds',
        },
      ];

return (
    <Box sx={{ width: 1000, height: 450, margin: 10}}>
      <ImageList variant="masonry" cols={3} gap={8}>
        {itemData.map((item) => (
 
        <ImageListItem key={item.img}>
        <img
          srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
          src={`${item.img}?w=248&fit=crop&auto=format`}
          alt={item.title}
          loading="lazy"
          onClick={() => handleOpen(item.img)} // שורה זו נוספה
          style={{ cursor: 'pointer' }} // שורה זו נוספה
        />
            <ImageListItemBar
              sx={{
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.7) 0%, ' +
                  'rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
              }}
              title={item.title}
              position="bottom"
              actionIcon={
                <Box>
                  <IconButton
                    sx={{ color: 'white' }}
                    aria-label={`download ${item.title}`}>
                    <DownloadIcon />
                  </IconButton>
                  <IconButton
                    sx={{ color: 'white' }}
                    aria-label={`share ${item.title}`}>
                    <ShareIcon />
                  </IconButton>
                  <IconButton
                    sx={{ color: 'white' }}
                    aria-label={`delete ${item.title}`}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
              actionPosition="left"
            />
          </ImageListItem>
        ))}
      </ImageList>

      <Modal
      open={!!selectedImage} onClose={handleClose}
      >
        <Box
    sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxHeight: '80%',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden', // הוספת overflow: 'hidden'
      }}
          >
          {/* {selectedImage && (
            <img
              src={selectedImage}
              alt="Selected"
              style={{ width: 'auto',  maxHeight: '100%' }} 
            />
          )} */}
               {selectedImage && (
            <>
              <img
                src={selectedImage}
                alt="Selected"
                style={{ width: 'auto', maxHeight: '80vh', marginBottom: '16px' }}
              />
              <Box>
                <IconButton sx={{ color: 'black' }} aria-label="download">
                  <DownloadIcon />
                </IconButton>
                <IconButton sx={{ color: 'black' }} aria-label="share">
                  <ShareIcon />
                </IconButton>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );

}

function srcset(image: string, width: number, height: number, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${width * cols}&h=${height * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${width * cols}&h=${
      height * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}