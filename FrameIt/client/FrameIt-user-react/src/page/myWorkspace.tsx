import React from "react";
import { Container, Typography, Grid, Card, CardContent, Button } from "@mui/material";
import { CloudUpload, Collections, Filter, Edit } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../component/global-states/store";

const MyWorkspace: React.FC = () => {

    const userName = useSelector((state: RootState) => state.user.user?.name);

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h2" color="primary" fontWeight={800} gutterBottom>
                hi {userName ?? ""}
            </Typography>
            <Typography variant="h3" gutterBottom>
                Welcome to Your Workspace
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Here you can upload images, create collages, use AI filtering, and manage your collections.
            </Typography>
            <Grid container spacing={3} >
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <CloudUpload fontSize="large" />
                            <Typography variant="h6">Upload Images</Typography>
                            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                                Upload
                            </Button>
                        </CardContent>
                    </Card>
                </Grid >
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Edit fontSize="large" />
                            <Typography variant="h6">Create Collage</Typography>
                            <Button variant="contained" color="secondary" fullWidth sx={{ mt: 2 }}>
                                Create
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Filter fontSize="large" />
                            <Typography variant="h6">AI <br /> Filtering</Typography>
                            <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                                Apply
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Collections fontSize="large" />
                            <Typography variant="h6">My Collections</Typography>
                            <Button variant="contained" color="secondary" fullWidth sx={{ mt: 2 }}>
                                Manage
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default MyWorkspace;
