import { Box, Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";


function EmptyCart() {

    const navigate = useNavigate();
    const imgurl = 'https://cdn-icons-png.flaticon.com/512/11329/11329060.png';

    const handleClick = () => {
        navigate('/user/shopping');
    }

    return (
        <Box className="w-full h-screen p-10 flex justify-center items-center">
            <Box className="text-center">
                <img src={imgurl} alt="Empty Cart" className="w-56 mx-auto" />
                <Typography variant="h6" className="mt-6 text-gray-800">
                    Your cart is empty!
                </Typography>
                <span className="block mt-2 text-gray-600">Add items to it now.</span>
                <Button variant="contained" onClick={handleClick} className="mt-5" sx={{
                    backgroundColor: "#3498DB", 
                    "&:hover": { backgroundColor: "#2980B9" } 
                }}>Continue Shopping</Button>
            </Box>
        </Box>
    )

}
export default EmptyCart;