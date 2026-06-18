export default function Dashboard() {
  //   const theme = useTheme();
  //   return (
  //     <Box>
  //       <Stack spacing={0.5} sx={{ mb: 3 }}>
  //         <Typography variant="h4">
  //           لوحة التحكم
  //         </Typography>
  //         <Typography color="text.secondary">
  //           نظرة عامة على التشغيل، الإيرادات، والتنبيهات.
  //         </Typography>
  //       </Stack>
  //       <Grid container spacing={2.5}>
  //         {stats.map((item) => {
  //           const Icon = item.icon;
  //           return (
  //             <Grid key={item.title} size={{ xs: 12, sm: 6, md: 3 }}>
  //               <Card>
  //                 <CardContent>
  //                   <Stack direction="row" spacing={2} alignItems="center">
  //                     <Box
  //                       sx={{
  //                         width: 48,
  //                         height: 48,
  //                         borderRadius: 3,
  //                         display: "grid",
  //                         placeItems: "center",
  //                         color: "primary.main",
  //                         bgcolor:
  //                           theme.palette.mode === "dark"
  //                             ? "rgba(255,255,255,0.06)"
  //                             : "rgba(25,118,210,0.08)",
  //                       }}
  //                     >
  //                       <Icon />
  //                     </Box>
  //                     <Box>
  //                       <Typography variant="h5" fontWeight={800}>
  //                         {item.value}
  //                       </Typography>
  //                       <Typography variant="body2" color="text.secondary">
  //                         {item.title}
  //                       </Typography>
  //                     </Box>
  //                   </Stack>
  //                 </CardContent>
  //               </Card>
  //             </Grid>
  //           );
  //         })}
  //         <Grid size={{ xs: 12, md: 8 }}>
  //           <Card>
  //             <CardContent>
  //               <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
  //                 الإيرادات الأسبوعية
  //               </Typography>
  //               <LineChart
  //                 height={300}
  //                 xAxis={[
  //                   {
  //                     scaleType: "point",
  //                     data: ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"],
  //                   },
  //                 ]}
  //                 series={[
  //                   {
  //                     data: [120, 180, 150, 220, 260, 240, 310],
  //                     label: "الإيرادات",
  //                   },
  //                 ]}
  //               />
  //             </CardContent>
  //           </Card>
  //         </Grid>
  //         <Grid size={{ xs: 12, md: 4 }}>
  //           <Card>
  //             <CardContent>
  //               <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
  //                 الرحلات حسب الخط
  //               </Typography>
  //               <BarChart
  //                 height={300}
  //                 xAxis={[
  //                   {
  //                     scaleType: "band",
  //                     data: ["خط 1", "خط 2", "خط 3", "خط 4"],
  //                   },
  //                 ]}
  //                 series={[
  //                   {
  //                     data: [24, 18, 31, 14],
  //                     label: "عدد الرحلات",
  //                   },
  //                 ]}
  //               />
  //             </CardContent>
  //           </Card>
  //         </Grid>
  //       </Grid>
  //     </Box>
  //   );
}
