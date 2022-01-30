import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import CustomTable from 'components/CustomTable';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PieChart, Pie, Cell } from 'recharts';
import RectangleIcon from '@mui/icons-material/Rectangle';

const headers = [
    'Batsman', '', 'Bowler', ''
]

const dummy_rows = [
    ['Mithali', '50 (85)', 'Ismail', '3-28 (10)'],
    ['Harmanpreet', '40 (41)', 'Mlaba', '2-41 (10)'],
    ['Deepti', '27 (46)', 'Luus', '1-23 (5)']
]

const dummy_rows2 = [
    ['Lee', '83 (122)', 'Jhulan', '2-38 (10)'],
    ['Wolvaardt', '80 (110)', '', ''],
    ['Luus', '1 (9)', '', '']
]

const data01 = [
    {
        "name": "Ones",
        "value": 400
    },
    {
        "name": "Twos",
        "value": 300
    },
    {
        "name": "Threes",
        "value": 500
    },
    {
        "name": "Fours",
        "value": 200
    },
    {
        "name": "Sixes",
        "value": 278
    },
    {
        "name": "Extras",
        "value": 189
    }
];
const COLORS = ['#0088FE', '#c036c7', '#00C49F', '#c7363d', '#FFBB28', '#FF8042'];

const Summary = <>

    <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-inner-header"
        >
            <Typography sx={{ width: '33%', flexShrink: 0, fontWeight: "bold", marginLeft: "15%" }}>
                1082599
            </Typography>
            <Typography sx={{ width: '33%', flexShrink: 0, fontWeight: "bold", marginLeft: "auto", marginRight: "auto" }}>
                IPL
            </Typography>
            <Typography sx={{ width: '33%', flexShrink: 0, fontWeight: "bold", float: "right" }}>
                2017
            </Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Card>
                <CardHeader
                    sx={{ backgroundColor: '#555359', color: '#fff' }}
                    disableTypography={true}
                    title={<b>India</b>}
                />
                <CardContent>
                    <CustomTable header={headers} rows={dummy_rows} skip={1} limit={1} pagination={false} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader
                    sx={{ backgroundColor: '#555359', color: '#fff' }}
                    disableTypography={true}
                    title={<b>South Africa</b>}
                />
                <CardContent>
                    <CustomTable header={headers} rows={dummy_rows2} skip={1} limit={1} pagination={false} />
                </CardContent>
            </Card>

            <Card>
                <CardHeader
                    sx={{ backgroundColor: '#555359', color: '#fff', textAlign: 'center' }}
                    disableTypography={true}
                    title={<b>South Africa won by 8 wickets</b>}
                />
            </Card>
        </AccordionDetails>
    </Accordion>

    <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-inner-header"
        >
            <Typography sx={{ flexShrink: 0, fontWeight: "bold" }}>
                Runs Distribution
            </Typography>
        </AccordionSummary>
        <AccordionDetails>
            <Card sx={{ marginLeft: 'auto', marginRight: 'auto', width: '400px', height: '400px', float:"left" }}>
                <CardHeader title="India" />
                <CardContent>
                    <PieChart width={400} height={400}>
                        {/* <Legend /> */}
                        <Pie data={data01} dataKey="value" cx="50%" cy="40%" outerRadius={100} fill="#8884d8" label>
                            {
                                data01.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))
                            }
                        </Pie>
                    </PieChart>
                </CardContent>
            </Card>

            <Card sx={{ marginLeft: 'auto', marginRight: 'auto', width: '400px', height: '400px', float:"right" }}>
                <CardHeader title="South Africa" />
                <CardContent>
                    <PieChart width={400} height={400}>
                        {/* <Legend /> */}
                        <Pie data={data01} dataKey="value" cx="50%" cy="40%" outerRadius={100} fill="#8884d8" label>
                            {
                                data01.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))
                            }
                        </Pie>
                    </PieChart>
                </CardContent>
            </Card>
            <br/><br/><br/>
            <CustomTable headersEnabled={false} rows={[
          data01.map((entry, index) => (
            <>
            <RectangleIcon sx={{color:`${COLORS[index]}`}} />&nbsp;{entry.name}
            </>
          ))
            ]} skip={1} limit={1} pagination={false} />
        </AccordionDetails>

    </Accordion>
</>

export default Summary;