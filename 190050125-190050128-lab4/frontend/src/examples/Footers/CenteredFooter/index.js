/**
=========================================================
* Material Kit 2 React - v2.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-kit-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// prop-types is a library for typechecking of props
import Grid from "@mui/material/Grid";
// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";


function CenteredFooter() {
  return (
    <>
    <MKBox component="footer" py={2} sx={{ top: 'auto', bottom: 0 }}>
      <Grid container justifyContent="center">
        <MKTypography sx={{color:"#fff"}} variant="body2">Developed by Tulip &amp; Vibhav</MKTypography>
      </Grid>
    </MKBox>
    </>
  );
}

export default CenteredFooter;
