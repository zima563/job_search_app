import excel from "exceljs";
import fs from "fs"
import { catchError } from "../../middlewares/catchError.js";
import { applicationModel } from "../../../dataBases/models/application.model.js";
import { jobModel } from "../../../dataBases/models/job.model.js";

function formatDate(date) {
  const isoString = date.toISOString();
  const formattedDate = isoString.slice(0, 10); // Extracts characters from index 0 to 9 (YYYY-MM-DD)
  return formattedDate;
}

const createExcelSheet = catchError(async (req, res, next) => {
  const { companyId, day } = req.body;
  let job = await jobModel.find({ company: companyId });

  const date = new Date(day);
  let jobIds = [];
  job.forEach((item) => {
    jobIds.push(item._id);
  });
  let application = await applicationModel
    .find({
      jobId: jobIds,
      date: { $gte: date, $lt: new Date(date.getTime() + 86400000) },
    })
    .populate("userId", "-_id");
  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet("applications");

  worksheet.columns = [
    { header: "Applicant Name", key: "applicantName", width: 20 },
    { header: "Email", key: "email", width: 30 },
    { header: "MobileNumber", key: "mobileNumber", width: 15 },
    { header: "Technical Skills", key: "techSkills", width: 30 },
    { header: "Soft Skills", key: "softSkills", width: 30 },
  ];

  application.forEach((application) => {
    worksheet.addRow({
      applicantName: application.userId.userName,
      email: application.userId.email,
      mobileNumber: application.userId.mobileNumber,
      techSkills: application.userTechSkills.join(", "), // Convert array to string
      softSkills: application.userSoftSkills.join(", "),
    });
  });

  const fileName = `applications_${companyId}_${day}.xlsx`;
  const filePath = `./uploads/${fileName}`;

  await workbook.xlsx.writeFile(filePath);
  // res.json({ msg: "success", filePath, fileName });
  res.download(filePath, fileName, () => {
    fs.unlinkSync(filePath);
  });
});

export { createExcelSheet };
