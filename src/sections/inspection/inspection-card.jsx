import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function InspectionCard({ part, baseUrl }) {
  const router = useRouter();
  const renderStatus = (
    <Label
      variant="filled"
      color={(part?.JUST_ON === 'X,Y' && 'error') || 'info'}
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      {part?.JUST_ON}
    </Label>
  );

  const renderImg = (
    <Box
      component="img"
      alt={part?.PART_NAME}
      className="hover:scale-105 duration-300"
      src={
        part?.FILENAME === '' || part?.FILENAME === null
          ? 'https://placehold.co/400x300/'
          : `${baseUrl}/backend_qc_inspection/uploads/drawing/${part?.FILENAME}`
      }
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {part?.JUST_ON && renderStatus}
        {renderImg}
      </Box>

      <Stack spacing={0.5} sx={{ p: 3 }}>
        <Link
          color="inherit"
          underline="hover"
          variant="subtitle2"
          noWrap
          to={`check/${part.BSNCR_PART_NO}`}
        >
          {part?.BSNCR_PART_NO}
        </Link>
        <Typography fontSize={12}>{part?.CUSTOMER_NAME}</Typography>
      </Stack>
      <Box sx={{ p: 1 }} className="flex justify-end">
        <Button
          variant="contained"
          size="small"
          onClick={() => {
            router.push(`/check/${part.BSNCR_PART_NO}`);
          }}
        >
          Check
        </Button>
      </Box>
    </Card>
  );
}

InspectionCard.propTypes = {
  part: PropTypes.object,
  baseUrl: PropTypes.string,
};
