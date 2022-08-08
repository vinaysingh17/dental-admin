import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Card, CardContent, CardHeader, Divider, Typography } from '@mui/material'
import services from '../../../infrastructure/services'

const UserDetails = () => {
    const params = useParams()
    const [profile, setProfile] = useState({})

    useEffect(() => {
        const getProfile = async () => {
            try {
                const profileData = await services.user.fetchProfile({ id: params.userId })
                const dashboardUserData = await services.user.fetchDashboardUserData({ id: params.userId })
                dashboardUserData.data.profile = profileData.data
                console.log(dashboardUserData.data)
                setProfile(dashboardUserData.data)
            } catch (error) {
                console.log('Error: ', error)
            }
        }

        getProfile()
    }, [])

    return (
        <Box>

            {/* Breadcrumb */}
            <Box sx={{ background: '#EFF5F8', width: '100%', height: '250px', padding: '30px 60px' }}>
                <Box sx={{ background: '#e9eeff', borderRadius: '5px', padding: '18px 30px' }}>
                    <Typography>Home / Users / {profile?.user_detail?.name}</Typography>
                </Box>
            </Box>

            {/* 3 Boxes */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    padding: '50px',
                    position: 'relative',
                    top: '-150px',
                }}
            >

                {/* Personal Information */}
                <Card sx={{ width: '450px', marginBottom: '50px' }}>
                    <CardHeader
                        title="Personal Information"
                    />
                    <Divider />
                    <CardContent>
                        <table cellSpacing={20}>
                            <tr>
                                <td style={{ fontWeight: 'bold', marginRight: '15px' }}>Name:</td>
                                <td>{profile?.profile?.firstName} {profile?.profile?.lsstName}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold', marginRight: '15px' }}>Email:</td>
                                <td>{profile?.profile?.email}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold', marginRight: '15px' }}>Phone:</td>
                                <td>{profile?.profile?.phone}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold', marginRight: '15px' }}>Area of Practice:</td>
                                <td>{profile?.profile?.area_of_practise}</td>
                            </tr>
                        </table>
                    </CardContent>
                </Card>

                {/* Subscription */}
                <Card sx={{ width: '450px', marginBottom: '50px' }}>
                    <CardHeader
                        title="Subscription"
                    />
                    <Divider />
                    <CardContent sx={{ padding: '20px 40px' }}>

                        {/* Current Active Plan */}
                        <Box>
                            <Typography>Current Active Plan</Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    background: '#e9eeff',
                                    padding: '15px',
                                    borderRadius: '5px',
                                    marginTop: '10px',
                                }}
                            >
                                <Typography>
                                    {profile?.profile?.subscriptionData?.subscription?.name}:
                                </Typography>
                                <Typography>${profile?.profile?.subscriptionData?.subscription?.amount} / month</Typography>
                            </Box>
                        </Box>

                        {/* Last Active Plan */}
                        <Box marginTop='20px'>
                            <Typography>Last Active Plan</Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    background: '#e9eeff',
                                    padding: '15px',
                                    borderRadius: '5px',
                                    marginTop: '10px',
                                }}
                            >
                                <Typography>
                                    Short Term:
                                </Typography>
                                <Typography component='p'>
                                    $0.00 / month
                                    <Typography
                                        fontFamily='Monteserrat'
                                        fontSize='12px'
                                        fontWeight='500'
                                        color='#d0021b'
                                        component='span'
                                        sx={{ marginLeft: '10px' }}
                                    >
                                        Expire
                                    </Typography>
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>

                {/* Test Count */}
                <Card sx={{ width: '450px', marginBottom: '50px' }}>
                    <CardHeader
                        title="Test Count"
                    />
                    <Divider />
                    <CardContent>
                        <table cellSpacing={20}>
                            <tr>
                                <td style={{ fontWeight: 'bold', marginRight: '15px' }}>Created Test:</td>
                                <td>{profile?.test_detail?.test_created}</td>
                            </tr>
                            <tr>
                                <td style={{ fontWeight: 'bold', marginRight: '15px' }}>Completed Test:</td>
                                <td>{profile?.test_detail?.test_completed}</td>
                            </tr>
                        </table>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    )
}

export default UserDetails