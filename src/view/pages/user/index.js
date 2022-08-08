import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from "@material-ui/core";
import { Box, Container, Divider, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from "@mui/material";
import services from '../../../infrastructure/services';
import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded'

const useStyles = makeStyles((theme) => ({
    root: {
        padding: '0px !important',
        display: "flex",
        flexDirection: "column",
    },
    searchBox: {
        height: '45px',
        width: '380px',
        padding: '14px 40px',
        marginTop: '50px',
        marginBottom: '30px',
        border: '1px solid #c2c2c2',
        background: '#f3f3f3',
        borderRadius: '32px',
        outline: 'none',
    },
    tableHeader: {
        fontWeight: '600 !important',
        fontSize: '18px !important',
        color: '#494949 !important',
    },
    tableValue: {
        fontWeight: '500 !important',
        fontSize: '14px !important',
        color: '#494949 !important',
    },
    tableEmailValue: {
        fontWeight: '500 !important',
        fontSize: '14px !important',
        letterSpacing: '0.02em !important',
        textDecoration: 'underline !important',
        color: '#d0021b !important',
        // cursor: 'pointer !important',
    }
}));

export default function User() {
    const classes = useStyles();
    const history = useHistory();
    const [page, setPage] = useState(1)
    const [limit, setLimit] = useState(10)
    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([])
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await services.user.fetchUsers({ limit: limit, page: page, search: search });
                setUsers(response.data)
            } catch (error) {
                console.log('Error: ', error)
            }
        }

        getUsers()
    }, [page, limit, search])

    return (
        <Container className={classes.root}>

            {/* Breadcrumb */}
            <Box sx={{ background: '#EFF5F8', width: '100%', height: '250px', padding: '30px 60px' }}>
                <Box sx={{ background: '#e9eeff', borderRadius: '5px', padding: '18px 30px' }}>
                    <Typography>Home / Users </Typography>
                </Box>
            </Box>

            {/* Content */}
            <Box position='relative' top='-220px' padding='50px'>

                {/* Search Box */}
                <input
                    type="search"
                    className={classes.searchBox}
                    placeholder='Search'
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />

                {/* Table */}
                {
                    users.length === 0 ? (
                        <Box sx={{ textAlign: 'center', marginTop: '50px' }}>
                            <Typography>No users found.</Typography>
                        </Box>
                    ) : (
                        <TableContainer component={Paper} sx={{ padding: '20px' }}>
                            <Typography fontWeight='500' fontSize='18px'>All Users</Typography>
                            <Divider sx={{ marginBottom: '50px' }} />
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.tableHeader}>Email</TableCell>
                                        <TableCell className={classes.tableHeader}>First Name</TableCell>
                                        <TableCell className={classes.tableHeader}>Last Name</TableCell>
                                        <TableCell className={classes.tableHeader}>Group Name</TableCell>
                                        <TableCell className={classes.tableHeader}></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        users?.map(user => (
                                            <TableRow key={user._id}>
                                                <TableCell className={classes.tableEmailValue}>{user.email}</TableCell>
                                                <TableCell className={classes.tableValue}>{user.firstName}</TableCell>
                                                <TableCell className={classes.tableValue}>{user.lastName}</TableCell>
                                                <TableCell className={classes.tableValue}>{user.area_of_practise}</TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        sx={{
                                                            background: '#e9e9e9'
                                                        }}
                                                        onClick={() => history.push(`/users/${user._id}`)}
                                                    >
                                                        <RemoveRedEyeRoundedIcon sx={{ color: '#d0021b !important' }} />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                                <TableRow>
                                    <TablePagination
                                        count={limit}
                                        page={page}
                                        onPageChange={(e, newPage) => setPage(newPage)}
                                        rowsPerPage={limit}
                                        onRowsPerPageChange={e => setLimit(e.target.value)}
                                        labelRowsPerPage='Users per page'
                                        rowsPerPageOptions={[10, 20, 30]}
                                    />
                                </TableRow>
                            </Table>
                        </TableContainer>
                    )
                }
            </Box>
        </Container>
    );
}
