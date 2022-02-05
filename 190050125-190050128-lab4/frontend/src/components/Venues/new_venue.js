import { Box, Button, Card, TextField } from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Snackbar from '@mui/material/Snackbar';
// Material Kit 2 React components
import MKBox from "components/MKBox";
import BaseLayout from "layouts/sections/components/BaseLayout";
import { forwardRef, useState } from "react";


const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

function VenueAdd(props) {
    const [venue_name, setVenueName] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [capacity, setCapacity] = useState("");
    const [buttonVal, setButtonVal] = useState("Submit");
    const [btnStatus, setBtnStatus] = useState(false);
    const [open, setOpen] = useState(false);
    const [sev, setSev] = useState("success");
    const [msg, setMsg] = useState("Submitted!");

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };

    const handleChange = (e, setF) => {
        setF(e.target.value);
    }

    const submit = () => {
        setButtonVal("Submitting...");
        setBtnStatus(true);
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ venue_name: venue_name, city_name: city, country_name: country, capacity: capacity })
        };
        fetch(`http://localhost:8081/venues/add`, requestOptions)
            .then(res => res.json().then(data => ({ status: res.status, body: data })))
            .then(data => {
                let body = data.body;

                if (data.status === 200) {
                    // setRows(body.data.map(venue => formatter(venue)));
                    setSev("success");
                    setMsg("Submitted");
                    setVenueName("");
                    setCity("");
                    setCountry("");
                    setCapacity("");
                }
                else {
                    setSev("error");
                    setMsg("Error: " + body.error);
                    console.log("Error in Venues add");
                    console.log(body.error);
                    // setRows([["Some error occured. Check logs.", ""]]);
                }
                setOpen(true);
                setButtonVal("Submit");
                setBtnStatus(false);
            })
    }

    return (
        <BaseLayout title="Add Venue"
            breadcrumb={[
                { label: "Home", route: "/" },
                { label: "Add Venue" },
            ]}>
            <MKBox component="section" py={{ xs: 3, md: 3 }}>
                <Container>
                    <Grid container alignItems="center" justifyContent="center" minHeight="70vh">
                        <Grid item xs={12} lg={9}>
                            <Card sx={{ padding: 5, width:"60%", marginLeft:'auto', marginRight:'auto', marginTop:-20 }}>
                                <Box sx={{ alignItems: 'center' }}>
                                    <TextField margin="dense" fullWidth id="venue-name" label="Venue Name" value={venue_name} onChange={(e) => handleChange(e, setVenueName)} variant="outlined" />
                                    <br /><TextField margin="dense" sx={{ width: "49%" }} id="city" label="City" value={city} onChange={(e) => handleChange(e, setCity)} variant="outlined" />
                                    <TextField margin="dense" sx={{ width: "49%", float: "right" }} id="country" value={country} onChange={(e) => handleChange(e, setCountry)} label="Country" variant="outlined" />
                                    <br /><TextField type="number" margin="dense" sx={{ width: "49%" }} id="capacity" value={capacity} onChange={(e) => handleChange(e, setCapacity)} label="Capacity" variant="outlined" />
                                    <Button sx={{ width: "30%", margin: "10px", float: "right", color: "#fff" }} variant="contained" onClick={submit} disabled={btnStatus}>{buttonVal}</Button>
                                </Box>
                            </Card>
                            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                                <Alert onClose={handleClose} severity={sev} sx={{ width: '100%' }}>
                                    {msg}
                                </Alert>
                            </Snackbar>
                        </Grid>
                    </Grid>
                </Container>
            </MKBox>
        </BaseLayout>
    );
}

export default VenueAdd;