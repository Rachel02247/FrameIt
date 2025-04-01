/* eslint-disable react-refresh/only-export-components */

import { Box, IconButton } from "@mui/material"
import StarIcon from '@mui/icons-material/Star';


export default () => {



    return (<>

<IconButton
                sx={{
                    position: 'absolute',color: 'white',  top: 550!, left: 20, background: "linear-gradient(135deg, purple, blue)",
                    '&:hover': {
                        bgcolor: 'linear-gradient(135deg, blue, purple)'
                    },
                    '&:click':{
                        bgcolor: 'linear-gradient(135deg, blue, purple)'

                    }
                }}
            >
                <StarIcon />
               
            </IconButton>
    </>)
}