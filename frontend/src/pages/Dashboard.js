import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Grid, 
  Paper, 
  Box,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import axios from 'axios';
import PublicIcon from '@mui/icons-material/Public';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const Dashboard = () => {
  const [stats, setStats] = useState({
    countriesCount: 0,
    activeCountriesCount: 0,
    priceRulesCount: 0,
    activePriceRulesCount: 0,
    recentCountries: [],
    recentPriceRules: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch countries
        const countriesRes = await axios.get('/api/countries');
        const activeCountries = countriesRes.data.filter(c => c.active);
        
        // Fetch price rules
        const priceRulesRes = await axios.get('/api/prices');
        const activePriceRules = priceRulesRes.data.filter(p => p.active);
        
        setStats({
          countriesCount: countriesRes.data.length,
          activeCountriesCount: activeCountries.length,
          priceRulesCount: priceRulesRes.data.length,
          activePriceRulesCount: activePriceRules.length,
          recentCountries: countriesRes.data.slice(0, 5),
          recentPriceRules: priceRulesRes.data.slice(0, 5)
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              bgcolor: '#e3f2fd'
            }}
          >
            <PublicIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h5">{stats.countriesCount}</Typography>
            <Typography variant="body2" color="text.secondary">Total Countries</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              bgcolor: '#e8f5e9'
            }}
          >
            <PublicIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
            <Typography variant="h5">{stats.activeCountriesCount}</Typography>
            <Typography variant="body2" color="text.secondary">Active Countries</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              bgcolor: '#fff8e1'
            }}
          >
            <AttachMoneyIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
            <Typography variant="h5">{stats.priceRulesCount}</Typography>
            <Typography variant="body2" color="text.secondary">Total Price Rules</Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6} lg={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 2, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              bgcolor: '#ffebee'
            }}
          >
            <AttachMoneyIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
            <Typography variant="h5">{stats.activePriceRulesCount}</Typography>
            <Typography variant="body2" color="text.secondary">Active Price Rules</Typography>
          </Paper>
        </Grid>
        
        {/* Recent Items */}
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader title="Recent Countries" />
            <CardContent>
              <List>
                {stats.recentCountries.length > 0 ? (
                  stats.recentCountries.map((country, index) => (
                    <React.Fragment key={country.id}>
                      <ListItem>
                        <ListItemText 
                          primary={`${country.name} (${country.code})`} 
                          secondary={country.active ? 'Active' : 'Inactive'} 
                        />
                      </ListItem>
                      {index < stats.recentCountries.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No countries added yet" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader title="Recent Price Rules" />
            <CardContent>
              <List>
                {stats.recentPriceRules.length > 0 ? (
                  stats.recentPriceRules.map((rule, index) => (
                    <React.Fragment key={rule.id}>
                      <ListItem>
                        <ListItemText 
                          primary={`${rule.type === 'percentage' ? rule.value + '%' : '$' + rule.value}`} 
                          secondary={`${rule.country?.name || 'Unknown'} - ${rule.active ? 'Active' : 'Inactive'}`} 
                        />
                      </ListItem>
                      {index < stats.recentPriceRules.length - 1 && <Divider />}
                    </React.Fragment>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No price rules added yet" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 