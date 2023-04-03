import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@mui/material/Pagination';

interface CustomPaginationProps {
  currentPage: number;
  handlePageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  pageCount: number;
}

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  handlePageChange,
  pageCount,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Pagination
        color="primary"
        count={pageCount}
        page={currentPage}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default CustomPagination;
