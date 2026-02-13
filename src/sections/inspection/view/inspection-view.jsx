import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import InspectionCard from '../inspection-card';

// ----------------------------------------------------------------------

export default function InspectionView() {
  const baseURL = import.meta.env.VITE_BASE_URL;
  const [load, setLoad] = useState(true);
  const [parts, setParts] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredParts, setFilteredParts] = useState([]);
  const getAllPart = useCallback(async () => {
    await axios
      .post(`${baseURL}/backend_qc_inspection/api`, {
        router: 'getAllParts',
      })
      .then((res) => {
        if (res.data.status === 'Ok' && !res.data.err) {
          setParts(res.data.result);
          setFilteredParts(res.data.result);
          setLoad(false);
        } else {
          setParts([]);
          setFilteredParts([]);
        }
      });
  }, [baseURL]);
  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    setSearch(searchTerm);
    if (searchTerm.trim() === '') {
      setFilteredParts(parts);
    } else {
      const filtered = parts.filter((part) =>
        part.BSNCR_PART_NO.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredParts(filtered);
    }
  };
  useEffect(() => {
    getAllPart();
  }, [getAllPart]);
  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Inspection
      </Typography>
      <div className="flex justify-start p-2 items-center gap-x-2">
        <i className="fa-solid fa-magnifying-glass text-[18px]" />
        <TextField
          size="small"
          placeholder="Search PSTH Part No."
          value={search}
          onChange={handleSearch}
        />
      </div>

      <Grid container spacing={3}>
        {load ? (
          <p>Loading ....</p>
        ) : (
          filteredParts?.map((part) => (
            <Grid key={part.Id} xs={12} sm={6} md={3}>
              <InspectionCard part={part} baseUrl={baseURL} />
            </Grid>
          ))
        )}
        {filteredParts?.length === 0 && (
          <div className="flex justify-center mt-[1rem] w-full">
            <p className="text-[red]">- Not Found -</p>
          </div>
        )}
      </Grid>
    </Container>
  );
}
