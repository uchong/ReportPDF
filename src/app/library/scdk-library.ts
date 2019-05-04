// tslint:disable:one-line

import * as loadsh from 'lodash';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import { any } from '@uirouter/core';
import { fieldEmitterService } from '../components/forms/sdk-formly/custom-types/formlyCustomTypes';


interface HeaderCanvas {
    canvas: any;
    base64: string;
    xPos: number;
    yPos: number;
    drawWidth: number;
    drawHeight: number;
}

interface HeaderOption {
    logoMarginLeft: number;
    logoMarginTopDown: number;
    width: number;
    height: number;
}

function createHeaderCanvas(uri, options: HeaderOption): Promise<HeaderCanvas> {
    const logoMarginLeft = options.logoMarginLeft;
    const logoMarginTopDown = options.logoMarginTopDown;
    const PDF_Width = options.width;
    const maxHeight = options.height;

    const promise = new Promise( function(resolve, reject)  {
        const imgLogo = new Image() as HTMLImageElement;

        imgLogo.onload = function() {
            const canvasHeader = document.createElement('canvas');
            const headerCtx = canvasHeader.getContext('2d');
            canvasHeader.height = imgLogo.naturalHeight;
            canvasHeader.width = imgLogo.naturalWidth;
            headerCtx.fillStyle = 'white';
            headerCtx.fillRect(0, 0, canvasHeader.width, canvasHeader.height);
            headerCtx.drawImage(imgLogo, 0, 0, imgLogo.width, imgLogo.height);

            let xPos, yPos, drawHeight, drawWidth;
            const ratioimg = imgLogo.width / imgLogo.height;
            drawHeight = maxHeight - 2 * logoMarginTopDown;
            drawWidth = ratioimg * drawHeight;
            xPos = PDF_Width - drawWidth - logoMarginLeft;
            yPos = logoMarginTopDown;
            const base64 = canvasHeader.toDataURL('image/png');

            resolve({ canvas: canvasHeader, base64, xPos, yPos, drawHeight, drawWidth});
        };

        imgLogo.src = uri;

    });

    return promise as Promise<HeaderCanvas>;

}


export function inexactComparison(string1, string2){
    if (!string2) {return false; }
    return (string1.replace(/ /g, '').toUpperCase() === string2.replace(/ /g, '').toUpperCase());
}

export function randomId() {
    return Math.floor(Math.random() * 999999) + 1;
}

export const MARGIN = 30;
export const PDF_Width = 435 - MARGIN;
export const PDF_Height = 630;
export const LOGO_WIDTH = 70;
export const LOGO_HEIGHT = 70;
export const AVATAR_WIDTH = 50;
export const AVATAR_HEIGHT = 50;
export const FONT_SIZE_HEADING = 20;
export const FONT_SIZE_SUBHEADING = 14;
export const FONT_SIZE_TITLE = 10;
export const FONT_SIZE_TEXT = 12;
export const FONT_SIZE_AVATAR_TITLE = 12;
export const FONT_SIZE_AVATAR_NAME = 10;

export function addToPdf(pdf, data: any, files: any, checked_ids: any, scale = 1) {
    const promise = new Promise(function(resolve, reject) {
        let flagEmpty = true;
        if ((<HTMLInputElement>document.getElementById('mat-checkbox-1-input')).checked) {
            pdf = generateSpecs(pdf, MARGIN, LOGO_HEIGHT);
            flagEmpty = false;
        }
        if ((<HTMLInputElement>document.getElementById('mat-checkbox-2-input')).checked) {
            if (!flagEmpty) { pdf.addPage(); }
            pdf = generateInputForm(pdf, MARGIN, MARGIN + 10, data.jCustomForm_input.form.fields, data.jFormData_input);
            flagEmpty = false;
        }
        if ((<HTMLInputElement>document.getElementById('mat-checkbox-3-input')).checked) {
            if (!flagEmpty) { pdf.addPage(); }
            pdf = generateResultForm(pdf, MARGIN, MARGIN + 10, data.jCustomForm_output.form.fields, data.jFormData_output);
            flagEmpty = false;
        }
        if ((<HTMLInputElement>document.getElementById('mat-checkbox-4-input')).checked) {
            if (!flagEmpty) { pdf.addPage(); }
            pdf = generateImages(pdf, MARGIN, MARGIN + 10, files, checked_ids);
            flagEmpty = false;
        }
        resolve(pdf);
    });

    return promise;
}

export function generateSpecs(pdf, POSITION_X, POSITION_Y) {
    //logo image to pdf
    const img = new Image();
    img.src = 'assets/images/logo.jpg';
    pdf.addImage(img, 'jpg', PDF_Width - LOGO_WIDTH, 0, LOGO_WIDTH, LOGO_HEIGHT);
    //specification header section
    pdf.setFontSize(FONT_SIZE_HEADING);
    pdf.text(POSITION_X, POSITION_Y, document.getElementById('report_title').innerText);
    POSITION_Y += 20;
    //avatar section
    pdf.setFontSize(FONT_SIZE_AVATAR_TITLE);
    pdf.setTextColor(74, 74, 74);
    pdf.text(POSITION_X + 105, POSITION_Y, document.getElementById('sub_title_1').innerText);
    pdf.text(POSITION_X + 257, POSITION_Y, document.getElementById('sub_title_2').innerText);
    POSITION_Y += 5;
    pdf.addImage((<HTMLInputElement>document.getElementById('sub_img_1')).src, 'png', POSITION_X + 100, POSITION_Y, AVATAR_WIDTH, AVATAR_HEIGHT);
    pdf.addImage((<HTMLInputElement>document.getElementById('sub_img_2')).src, 'png', POSITION_X + 250, POSITION_Y, AVATAR_WIDTH, AVATAR_HEIGHT);
    POSITION_Y += 10;
    pdf.setFontSize(FONT_SIZE_AVATAR_NAME);
    pdf.text(POSITION_X + 100, POSITION_Y + AVATAR_HEIGHT, document.getElementById('sub_name_1').innerText);
    pdf.text(POSITION_X + 250, POSITION_Y + AVATAR_HEIGHT, document.getElementById('sub_name_2').innerText);
    //ticket and priority section
    POSITION_Y += AVATAR_HEIGHT + 30;
    pdf.setFontSize(FONT_SIZE_TITLE);
    pdf.setTextColor(184, 184, 184);
    pdf.text(POSITION_X, POSITION_Y, 'Ticket number');
    pdf.text(POSITION_X + 250, POSITION_Y, 'Priority');
    pdf.setFontSize(FONT_SIZE_TEXT);
    POSITION_Y += 15;
    pdf.setTextColor(0, 0, 0);
    pdf.text(POSITION_X, POSITION_Y, (<HTMLInputElement>document.getElementById('ticket_number')).value);
    pdf.text(POSITION_X + 250, POSITION_Y, (<HTMLInputElement>document.getElementById('priority_number')).value);
    POSITION_Y += 10;
    pdf.setDrawColor(184, 184, 184);
    pdf.line(POSITION_X, POSITION_Y, POSITION_X + 150, POSITION_Y);
    pdf.line(POSITION_X + 250, POSITION_Y, PDF_Width - 30, POSITION_Y);
    POSITION_Y += 7;
    pdf.setFontSize(FONT_SIZE_TITLE);
    pdf.setTextColor(184, 184, 184);
    pdf.text(POSITION_X + 250, POSITION_Y, document.getElementById('hint').innerText);
    //name section
    POSITION_Y += 20;
    pdf.setFontSize(FONT_SIZE_TITLE);
    pdf.setTextColor(184, 184, 184);
    pdf.text(POSITION_X, POSITION_Y, 'Name');
    pdf.setFontSize(FONT_SIZE_TEXT);
    pdf.setTextColor(0, 0, 0);
    POSITION_Y += 15;
    pdf.text(POSITION_X, POSITION_Y, (<HTMLInputElement>document.getElementById('#task-name')).value);
    POSITION_Y += 10;
    pdf.setDrawColor(184, 184, 184);
    pdf.line(POSITION_X, POSITION_Y, PDF_Width, POSITION_Y);
    //description section
    POSITION_Y += 25;
    pdf.setFontSize(FONT_SIZE_TITLE);
    pdf.setTextColor(184, 184, 184);
    pdf.text(POSITION_X, POSITION_Y, 'Description');
    pdf.setFontSize(FONT_SIZE_TEXT);
    pdf.setTextColor(0, 0, 0);
    POSITION_Y += 15;
    pdf.text(POSITION_X, POSITION_Y, pdf.splitTextToSize((<HTMLInputElement>document.getElementById('description_text')).value, PDF_Width - MARGIN));
    POSITION_Y += 10;
    pdf.setDrawColor(184, 184, 184);
    pdf.line(POSITION_X, POSITION_Y, PDF_Width, POSITION_Y);
    //status header section
    POSITION_Y += 40;
    pdf.setFontSize(FONT_SIZE_HEADING);
    pdf.setTextColor(0, 0, 0);
    pdf.text(POSITION_X, POSITION_Y, 'Status');
    //status content section
    POSITION_Y += 20;
    pdf.setFontSize(FONT_SIZE_TEXT);
    pdf.text(POSITION_X, POSITION_Y, document.getElementById('assigned_status').innerText);
    POSITION_X += 10;
    POSITION_Y += 15;
    //deadline section
    pdf.setFontSize(FONT_SIZE_TITLE);
    pdf.setTextColor(184, 184, 184);
    pdf.text(POSITION_X, POSITION_Y, 'Deadline');
    pdf.setFontSize(FONT_SIZE_TEXT);
    pdf.setTextColor(0, 0, 0);
    pdf.text(POSITION_X + 200, POSITION_Y + 5, 'Created:');
    pdf.text(POSITION_X + 270, POSITION_Y + 5, document.getElementById('created_date').innerText);
    POSITION_Y += 15;
    pdf.setFontSize(FONT_SIZE_TEXT);
    pdf.setTextColor(0, 0, 0);
    pdf.text(POSITION_X, POSITION_Y, (<HTMLInputElement>document.getElementById('deadline_status')).value);
    pdf.text(POSITION_X + 200, POSITION_Y + 10, 'Assigned:');
    pdf.text(POSITION_X + 270, POSITION_Y + 10, document.getElementById('assigned_date').innerText);
    POSITION_Y += 10;
    pdf.setDrawColor(184, 184, 184);
    pdf.line(POSITION_X, POSITION_Y, POSITION_X + 150, POSITION_Y);
    //schedule section
    POSITION_Y += 20;
    pdf.setFontSize(FONT_SIZE_TITLE);
    pdf.setTextColor(184, 184, 184);
    pdf.text(POSITION_X, POSITION_Y, 'Schedule date');
    pdf.setFontSize(FONT_SIZE_TEXT);
    pdf.setTextColor(0, 0, 0);
    pdf.text(POSITION_X + 200, POSITION_Y + 5, 'Last Update:');
    pdf.text(POSITION_X + 270, POSITION_Y + 5, document.getElementById('last_date').innerText);
    POSITION_Y += 15;
    pdf.setFontSize(FONT_SIZE_TEXT);
    pdf.setTextColor(0, 0, 0);
    pdf.text(POSITION_X, POSITION_Y, (<HTMLInputElement>document.getElementById('schedule_status')).value);
    POSITION_Y += 10;
    pdf.setDrawColor(184, 184, 184);
    pdf.line(POSITION_X, POSITION_Y, POSITION_X + 150, POSITION_Y);
    //sample header section
    POSITION_Y += 40;
    POSITION_X = MARGIN;
    pdf.setFontSize(FONT_SIZE_HEADING);
    pdf.setTextColor(0, 0, 0);
    pdf.text(POSITION_X, POSITION_Y, 'Samples');
    POSITION_X += 10;
    POSITION_Y += 10;
    //sample list section
    const el_sample_list = document.getElementById("sample_list").children;
    for (let i = 0; i < el_sample_list.length; i++) {
        POSITION_Y += 10;
        pdf.setFontSize(FONT_SIZE_TEXT);
        pdf.text(POSITION_X, POSITION_Y, '• ' + (<HTMLElement>el_sample_list[i]).innerText);
    }
    return pdf;
}

export function generateInputForm(pdf, POSITION_X, POSITION_Y, data, values) {
    //project header section
    pdf.setFontSize(FONT_SIZE_HEADING);
    pdf.setTextColor(0, 0, 0);
    pdf.text(POSITION_X, POSITION_Y, getFieldByKey(data, 'h139').templateOptions.label);
    POSITION_Y += 20;
    pdf.setFontSize(FONT_SIZE_SUBHEADING);
    pdf.text(POSITION_X, POSITION_Y, getFieldByKey(data, 'h279').templateOptions.label);
    POSITION_X += 10;
    POSITION_Y += 15;
    //project section
    pdf.setFontSize(FONT_SIZE_TITLE);
    pdf.setTextColor(184, 184, 184);
    pdf.text(POSITION_X, POSITION_Y, 'Code');
    pdf.text(POSITION_X + 150, POSITION_Y, 'Name');
    pdf.setFontSize(FONT_SIZE_TEXT);
    POSITION_Y += 15;
    pdf.setTextColor(0, 0, 0);
    pdf.text(POSITION_X, POSITION_Y, values.code);
    pdf.text(POSITION_X + 150, POSITION_Y, values.name);
    POSITION_Y += 10;
    pdf.setDrawColor(184, 184, 184);
    pdf.line(POSITION_X, POSITION_Y, POSITION_X + 100, POSITION_Y);
    pdf.line(POSITION_X + 150, POSITION_Y, POSITION_X + 300, POSITION_Y);
    POSITION_Y += 20;
    //team section
    pdf.setFontSize(FONT_SIZE_SUBHEADING);
    pdf.text(MARGIN, POSITION_Y, getFieldByKey(data, 'h277').templateOptions.label);
    POSITION_Y += 25;
    pdf = showCheckBoxItem(pdf, POSITION_X, POSITION_Y, 'APT', values.apt);
    pdf = showCheckBoxItem(pdf, POSITION_X + 100, POSITION_Y, 'PE', values.pe);
    pdf = showCheckBoxItem(pdf, POSITION_X + 200, POSITION_Y, 'Automation', values.automation);
    POSITION_Y += 15;
    pdf.line(POSITION_X, POSITION_Y, PDF_Width, POSITION_Y);
    POSITION_Y += 30;
    //samples header section
    pdf.setFontSize(FONT_SIZE_HEADING);
    pdf.setTextColor(0, 0, 0);
    pdf.text(MARGIN, POSITION_Y, getFieldByKey(data, 'h136').templateOptions.label);
    POSITION_Y += 15;
    //unit section
    pdf.setFontSize(FONT_SIZE_TITLE);
    pdf.setTextColor(184, 184, 184);
    pdf.text(POSITION_X, POSITION_Y, 'Units');
    POSITION_Y += 15;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(FONT_SIZE_TEXT);
    pdf.text(POSITION_X, POSITION_Y, values.units);
    POSITION_Y += 10;
    pdf.setDrawColor(184, 184, 184);
    pdf.line(POSITION_X, POSITION_Y, POSITION_X + 100, POSITION_Y);
    pdf = showCheckBoxItem(pdf, POSITION_X + 150, POSITION_Y - 10, 'Return samples', values.return_samples);
    pdf = showCheckBoxItem(pdf, POSITION_X + 250, POSITION_Y - 10, 'Don\'t return', values.dont_return);
    POSITION_Y += 30;
    //material header section
    pdf.setFontSize(FONT_SIZE_TEXT);
    pdf.setTextColor(0, 0, 0);
    pdf.text(MARGIN, POSITION_Y, getFieldByKey(data, 'material_description').templateOptions.label);
    POSITION_Y += 15;
    //material section
    pdf.setFontSize(FONT_SIZE_TITLE);
    pdf.text(MARGIN, POSITION_Y, pdf.splitTextToSize(values.material_description, PDF_Width - MARGIN));
    POSITION_Y += 50;
    //analysis header section
    pdf.setFontSize(FONT_SIZE_HEADING);
    pdf.setTextColor(0, 0, 0);
    pdf.text(MARGIN, POSITION_Y, getFieldByKey(data, 'h199').templateOptions.label);
    POSITION_Y += 20;
    //Requested Analysis section
    pdf.setFontSize(FONT_SIZE_SUBHEADING);
    pdf.text(MARGIN, POSITION_Y, getFieldByKey(data, 'h288').templateOptions.label);
    POSITION_X += 10;
    POSITION_Y += 15;
    pdf.setFontSize(FONT_SIZE_TITLE);
    pdf.setTextColor(184, 184, 184);
    pdf.text(POSITION_X, POSITION_Y, 'Methods');
    pdf.setFontSize(FONT_SIZE_TEXT);
    POSITION_Y += 15;
    pdf.setTextColor(0, 0, 0);
    pdf.text(POSITION_X, POSITION_Y, pdf.splitTextToSize(values.methods, PDF_Width - MARGIN));
    POSITION_Y += 10;
    pdf.setDrawColor(184, 184, 184);
    pdf.line(POSITION_X, POSITION_Y, PDF_Width, POSITION_Y);
    POSITION_Y += 20;
    //Analysis Purpose section
    pdf.setFontSize(FONT_SIZE_TEXT);
    pdf.text(MARGIN, POSITION_Y, getFieldByKey(data, 'h245').templateOptions.label);
    POSITION_Y += 25;
    pdf.setFontSize(FONT_SIZE_TEXT);
    pdf.text(POSITION_X, POSITION_Y, getFieldByKey(data, 'describe_the_purpose').templateOptions.label);
    POSITION_Y += 15;
    pdf.setFontSize(FONT_SIZE_TITLE);
    pdf.text(POSITION_X, POSITION_Y, pdf.splitTextToSize(values.describe_the_purpose, PDF_Width - MARGIN));
    POSITION_Y += 60;
    //Expected Outcome section
    pdf.setFontSize(FONT_SIZE_SUBHEADING);
    pdf.text(MARGIN, POSITION_Y, getFieldByKey(data, 'h262').templateOptions.label);
    POSITION_Y += 25;
    pdf.setFontSize(FONT_SIZE_TEXT);
    pdf.text(POSITION_X, POSITION_Y, getFieldByKey(data, 'textarea28').templateOptions.label);
    POSITION_Y += 15;
    pdf.setFontSize(FONT_SIZE_TITLE);
    pdf.text(POSITION_X, POSITION_Y, pdf.splitTextToSize(values.textarea28, PDF_Width - MARGIN));
    return pdf;
}

export function generateResultForm(pdf, POSITION_X, POSITION_Y, data, values) {
    //header section
    pdf.setFontSize(FONT_SIZE_HEADING);
    pdf.setTextColor(0, 0, 0);
    pdf.text(POSITION_X, POSITION_Y, getFieldByKey(data, 'h183').templateOptions.label);
    POSITION_X += 10;
    POSITION_Y += 20;
    //team section
    pdf.setFontSize(FONT_SIZE_TITLE);
    pdf.setTextColor(184, 184, 184);
    pdf.text(POSITION_X, POSITION_Y, 'Team');
    POSITION_Y += 15;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(FONT_SIZE_TEXT);
    pdf.text(POSITION_X, POSITION_Y, values.team);
    POSITION_Y += 10;
    pdf.setDrawColor(184, 184, 184);
    pdf.line(POSITION_X, POSITION_Y, PDF_Width, POSITION_Y);
    POSITION_Y += 15;
    //project section
    pdf.setFontSize(FONT_SIZE_TITLE);
    pdf.setTextColor(184, 184, 184);
    pdf.text(POSITION_X, POSITION_Y, 'Project code');
    pdf.text(POSITION_X + 200, POSITION_Y, 'Project name');
    pdf.setFontSize(FONT_SIZE_TEXT);
    POSITION_Y += 15;
    pdf.setTextColor(0, 0, 0);
    pdf.text(POSITION_X, POSITION_Y, values.project_code);
    pdf.text(POSITION_X + 200, POSITION_Y, values.project_name);
    POSITION_Y += 10;
    pdf.setDrawColor(184, 184, 184);
    pdf.line(POSITION_X, POSITION_Y, POSITION_X + 150, POSITION_Y);
    pdf.line(POSITION_X + 200, POSITION_Y, PDF_Width, POSITION_Y);
    POSITION_Y += 30;
    //samples header section
    pdf.setFontSize(FONT_SIZE_SUBHEADING);
    pdf.text(MARGIN, POSITION_Y, getFieldByKey(data, 'h27').templateOptions.label);
    POSITION_Y += 25;
    //samples section
    pdf.setFontSize(FONT_SIZE_TITLE);
    pdf.setTextColor(184, 184, 184);
    pdf.text(POSITION_X, POSITION_Y, 'Type');
    pdf.text(POSITION_X + 125, POSITION_Y, 'Name');
    pdf.text(POSITION_X + 325, POSITION_Y, 'N. units');
    pdf.setFontSize(FONT_SIZE_TEXT);
    POSITION_Y += 15;
    pdf.setTextColor(0, 0, 0);
    pdf.text(POSITION_X, POSITION_Y, values.type);
    pdf.text(POSITION_X + 125, POSITION_Y, values.name);
    pdf.text(POSITION_X + 325, POSITION_Y, values.n_units);
    POSITION_Y += 10;
    pdf.setDrawColor(184, 184, 184);
    pdf.line(POSITION_X, POSITION_Y, POSITION_X + 75, POSITION_Y);
    pdf.line(POSITION_X + 125, POSITION_Y, POSITION_X + 275, POSITION_Y);
    pdf.line(POSITION_X + 325, POSITION_Y, PDF_Width, POSITION_Y);
    POSITION_Y += 25;
    //material description section
    pdf.setFontSize(FONT_SIZE_TEXT);
    pdf.setTextColor(0, 0, 0);
    pdf.text(MARGIN, POSITION_Y, getFieldByKey(data, 'material_description').templateOptions.label);
    POSITION_Y += 15;
    pdf.setFontSize(FONT_SIZE_TITLE);
    pdf.text(MARGIN, POSITION_Y, pdf.splitTextToSize(values.material_description, PDF_Width - MARGIN));
    POSITION_Y += 50;
    //completion header section
    pdf.setFontSize(FONT_SIZE_SUBHEADING);
    pdf.text(MARGIN, POSITION_Y, getFieldByKey(data, 'h291').templateOptions.label);
    POSITION_Y += 25;
    //completion section
    pdf.setFontSize(FONT_SIZE_TITLE);
    pdf.setTextColor(184, 184, 184);
    pdf.text(POSITION_X, POSITION_Y, 'Completion date');
    pdf.text(POSITION_X + 200, POSITION_Y, 'Complexity');
    pdf.setFontSize(FONT_SIZE_TEXT);
    POSITION_Y += 15;
    pdf.setTextColor(0, 0, 0);
    pdf.text(POSITION_X, POSITION_Y, values.completion_date);
    pdf.text(POSITION_X + 200, POSITION_Y, values.complexity);
    POSITION_Y += 10;
    pdf.setDrawColor(184, 184, 184);
    pdf.line(POSITION_X, POSITION_Y, POSITION_X + 150, POSITION_Y);
    pdf.line(POSITION_X + 200, POSITION_Y, PDF_Width, POSITION_Y);
    POSITION_Y += 15;
    /////////////////////
    pdf.setFontSize(FONT_SIZE_TITLE);
    pdf.setTextColor(184, 184, 184);
    pdf.text(POSITION_X, POSITION_Y, 'FA Engineer');
    pdf.text(POSITION_X + 200, POSITION_Y, 'Working hours');
    pdf.setFontSize(FONT_SIZE_TEXT);
    POSITION_Y += 15;
    pdf.setTextColor(0, 0, 0);
    pdf.text(POSITION_X, POSITION_Y, values.fa_engineer);
    pdf.text(POSITION_X + 200, POSITION_Y, values.working_hours);
    POSITION_Y += 10;
    pdf.setDrawColor(184, 184, 184);
    pdf.line(POSITION_X, POSITION_Y, POSITION_X + 150, POSITION_Y);
    pdf.line(POSITION_X + 200, POSITION_Y, PDF_Width, POSITION_Y);
    POSITION_Y += 25;
    //conclusion section
    pdf.setFontSize(FONT_SIZE_TEXT);
    pdf.setTextColor(0, 0, 0);
    pdf.text(MARGIN, POSITION_Y, getFieldByKey(data, 'conclusion').templateOptions.label);
    POSITION_Y += 15;
    pdf.setFontSize(FONT_SIZE_TITLE);
    pdf.text(MARGIN, POSITION_Y, pdf.splitTextToSize(values.conclusion, PDF_Width - MARGIN));
    POSITION_Y += 50;
    return pdf;
}

export function generateImages(pdf, POSITION_X, POSITION_Y, files, checked_ids) {
    let IMAGE_WIDTH = 300;
    let IMAGE_HEIGHT = 150;
    let IMAGE_MARGIN = 50;
    const IMAGE_PADDING = 20;
    const showMode = getShowMode();
    const checkedFiles = getCheckedFiles(files, checked_ids);
    console.log(checkedFiles);
    if (showMode == 1) {
        IMAGE_WIDTH = 150;
        IMAGE_HEIGHT = 75;
        IMAGE_MARGIN = 40;
    }else if (showMode == 2) {
        IMAGE_WIDTH = 100;
        IMAGE_HEIGHT = 50;
        IMAGE_MARGIN = 40;
    }
    //image header section
    pdf.setFontSize(FONT_SIZE_HEADING);
    pdf.text(MARGIN, POSITION_Y, 'Images');
    POSITION_Y += 25;
    //image section
    pdf.setFontSize(FONT_SIZE_TITLE);
    pdf.setTextColor(0, 0, 0);
    if (showMode == 0) {
        for (let i = 0; i < checkedFiles.length; i++) {
            pdf.text(IMAGE_MARGIN, POSITION_Y, checkedFiles[i].filename);
            pdf.addImage(checkedFiles[i].picture, 'png', IMAGE_MARGIN, POSITION_Y + 5, IMAGE_WIDTH, IMAGE_HEIGHT);
            pdf.text(IMAGE_MARGIN, POSITION_Y + IMAGE_HEIGHT + 15, pdf.splitTextToSize('Figure' + (i + 1) + ': ' + checkedFiles[i].description, IMAGE_WIDTH));
            POSITION_Y += IMAGE_HEIGHT + 40;
            if (POSITION_Y > PDF_Height) {
                pdf.addPage();
                POSITION_Y = MARGIN + 10;
            }
        }
    }else if(showMode == 1) {
        for (let i = 0; i < checkedFiles.length; i += 2) {
            pdf.text(IMAGE_MARGIN, POSITION_Y, checkedFiles[i].filename);
            pdf.addImage(checkedFiles[i].picture, 'png', IMAGE_MARGIN, POSITION_Y + 5, IMAGE_WIDTH, IMAGE_HEIGHT);
            pdf.text(IMAGE_MARGIN, POSITION_Y + IMAGE_HEIGHT + 15, pdf.splitTextToSize('Figure' + (i + 1) + ': ' + checkedFiles[i].description, IMAGE_WIDTH));
            if (i + 1 == checkedFiles.length)  {
                break;
            }
            const X = IMAGE_MARGIN + IMAGE_PADDING + IMAGE_WIDTH;
            pdf.text(POSITION_X + X, POSITION_Y, checkedFiles[i + 1].filename);
            pdf.addImage(checkedFiles[i + 1].picture, 'png', POSITION_X + X, POSITION_Y + 5, IMAGE_WIDTH, IMAGE_HEIGHT);
            pdf.text(POSITION_X + X, POSITION_Y + IMAGE_HEIGHT + 15, pdf.splitTextToSize('Figure' + (i + 2) + ': ' + checkedFiles[i + 1].description, IMAGE_WIDTH));
            POSITION_Y += IMAGE_HEIGHT + 40;
            if (POSITION_Y > PDF_Height) {
                pdf.addPage();
                POSITION_Y = MARGIN + 10;
            }
        }
    }else if(showMode == 2) {
        for (let i = 0; i < checkedFiles.length; i += 3) {
            pdf.text(IMAGE_MARGIN, POSITION_Y, checkedFiles[i].filename);
            pdf.addImage(checkedFiles[i].picture, 'png', IMAGE_MARGIN, POSITION_Y + 5, IMAGE_WIDTH, IMAGE_HEIGHT);
            pdf.text(IMAGE_MARGIN, POSITION_Y + IMAGE_HEIGHT + 15, pdf.splitTextToSize('Figure' + (i + 1) + ': ' + checkedFiles[i].description, IMAGE_WIDTH));
            if (i + 1 == checkedFiles.length)  {
                break;
            }
            let X = IMAGE_MARGIN + IMAGE_PADDING + IMAGE_WIDTH;
            pdf.text(X, POSITION_Y, checkedFiles[i + 1].filename);
            pdf.addImage(checkedFiles[i + 1].picture, 'png', X, POSITION_Y + 5, IMAGE_WIDTH, IMAGE_HEIGHT);
            pdf.text(X, POSITION_Y + IMAGE_HEIGHT + 15, pdf.splitTextToSize('Figure' + (i + 2) + ': ' + checkedFiles[i + 1].description, IMAGE_WIDTH));
            if (i + 2 == checkedFiles.length)  {
                break;
            }
            X += IMAGE_PADDING + IMAGE_WIDTH;
            pdf.text(X, POSITION_Y, checkedFiles[i + 2].filename);
            pdf.addImage(checkedFiles[i + 2].picture, 'png', X, POSITION_Y + 5, IMAGE_WIDTH, IMAGE_HEIGHT);
            pdf.text(X, POSITION_Y + IMAGE_HEIGHT + 15, pdf.splitTextToSize('Figure' + (i + 3) + ': ' + checkedFiles[i + 2].description, IMAGE_WIDTH));
            POSITION_Y += IMAGE_HEIGHT + 40;
            if (POSITION_Y > PDF_Height) {
                pdf.addPage();
                POSITION_Y = MARGIN + 10;
            }
        }
    }
    return pdf;
}

export function getFieldByKey(data, key) {
    for (let i = 0; i < data.length; i++) {
        if (data[i].key == key) {
            return data[i];
        }
    }
    return [];
}

export function showCheckBoxItem(pdf, x, y, title, status) {
    const img = new Image();
    if (status) {
        img.src = 'assets/images/checked.png';
    }else {
        img.src = 'assets/images/unchecked.png';
    }
    pdf.addImage(img, 'png', x, y - 8, 10, 10);
    pdf.setFontSize(FONT_SIZE_TEXT);
    pdf.text(x + 15, y, title);
    return pdf;
}

export function getCheckedFiles(files, checked_ids) {
    const result = [];
    for (let i = 0; i < files.length; i++) {
        for (let j = 0; j < checked_ids.length; j++) {
            if (files[i].id == checked_ids[j]) {
                result.push(files[i]);
            }
        }
    }
    return result;
}

export function getShowMode() {
    if ((<HTMLInputElement>document.getElementById('radio_two-input')).checked) {
        return 1;
    }else if ((<HTMLInputElement>document.getElementById('radio_three-input')).checked) {
        return 2;
    }else if ((<HTMLInputElement>document.getElementById('radio_full-input')).checked) {
        return 0;
    }
    return 0;
}

export function toBytes(bytes: number = 0, precision: number = 2): string {
    if (isNaN(parseFloat(String(bytes))) || !isFinite(bytes)) { return '?'; }

    const units = [
        'bytes',
        'KB',
        'MB',
        'GB',
        'TB',
        'PB'
      ];

    let unit = 0;

    while (bytes >= 1024) {
      bytes /= 1024;
      unit++;
    }

    return bytes.toFixed(+ precision) + ' ' + units[unit];
  }

export function  getImageProperties(data)  {
    const imgElem = new Image();
    const promise = new Promise( function(resolve, reject) {
       imgElem.onload = function() {
       resolve({width: imgElem.width, height: imgElem.height});
       };
       imgElem.src = data;
    });

    return promise;
  }


export function autoFormat(x: number, digits){
    if (Number.isNaN(x)) {
      return '-';
    }

    if (x === 0){
      return '0';
    }

    if (!x) {
      return '-';
    }

    if (Math.abs(x) < 0.001){
      return x.toExponential(digits);
    }
    if (Math.abs(x) < 0.01){
      const xabs = Math.abs(x);
      if (xabs * 100 - Math.floor(xabs * 100) > 0.1) {
        return x.toExponential(digits);
      }
    }

    if (Math.abs(x) >= 10000){
      return x.toExponential(digits);
    }

    if (Number.isInteger(x)) {
      return x.toString();
    }
    else {
      return x.toFixed(digits);
    }
}

export const hashCode = (str) => {
    return str.split('').reduce((prevHash, currVal) =>
        // tslint:disable-next-line:no-bitwise
        (((prevHash << 5) - prevHash) + currVal.charCodeAt(0)) | 0, 0);
};


export function slugify(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '_')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '_')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

export function toaster(text, period= 2000){
    (Swal as any).fire({
        position: 'bottom',
        type: 'success',
        title: text,
        showConfirmButton: false,
        timer: period,
        toast: true,
      });
}


export const isCyclic = (obj) => {
    const keys = [];
    const stack = [];
    const stackSet = new Set();
    let detected = false;

    function detect(objAtt, key) {
        if (typeof objAtt !== 'object') { return; }

        if (stackSet.has(objAtt)) { // it's cyclic! Print the object and its locations.
            const oldindex = stack.indexOf(objAtt);
            const l1 = keys.join('.') + '.' + key;
            const l2 = keys.slice(0, oldindex + 1).join('.');
            console.log('CIRCULAR: ' + l1 + ' = ' + l2 + ' = ' + objAtt);
            console.log(objAtt);
            detected = true;
            return;
        }

        keys.push(key);
        stack.push(objAtt);
        stackSet.add(objAtt);
        for (const k in objAtt) { // dive on the object's children
            if (objAtt.hasOwnProperty(k)) { detect(objAtt[k], k); }
        }

        keys.pop();
        stack.pop();
        stackSet.delete(objAtt);
        return;
    }

    detect(obj, 'obj');
    return detected;
};


export class Model {

    static setFE(obj, variable: string = null, value: any = null, storeFE: Array<any> = null) {
        if (!obj.fe) { obj.fe = {}; }
        obj.fe[variable] = value;

        if (storeFE) { // option to save the FE in an external array dissociated to the model.
            let feItem = Model.getObject(storeFE, { 'id': obj.id });
            if (feItem) {
                feItem[variable] = value;
            } else {
                feItem = { id: obj.id };
                feItem[variable] = value;
                storeFE.push(feItem);
            }
        }
    }

    static getFE(obj, variable: string, defaultValue = null, storeFE: Array<any> = null) {
        if (obj.fe) {
            if (typeof (obj.fe[variable] !== 'undefined')) {
                return obj.fe[variable];
            } else {
                obj.fe[variable] = defaultValue;
            }
        } else {
            obj.fe = {};
            obj.fe[variable] = defaultValue;
        }
        return obj.fe[variable];
    }

    static getForeignKeyIdFromObject(object: any, field: any){
        const value = object[field];
        if (value === null || value === undefined) {return null; }

        if (typeof (value) === 'number' || typeof (value) === 'string') {
          return value;
        }

        if (value instanceof Array){
            return (value as any[]).map((e, i) => this.getForeignKeyIdFromObject(value, i));
        }

        if (value.hasOwnProperty('id')) {
            return object[field]['id'];
        }

      }


    static removedByArrayIndexes(arrObj: Array<any>, indexes: Array<number>) {
        if (!indexes || !arrObj) { return; }
        if (!indexes.length || !arrObj.length) { return; }
        const mask = new Array(arrObj.length);
        for (let i = indexes.length - 1; i >= 0; i--) {
            mask[indexes[i]] = true;
        }
        let offset = 0;
        for (let i = 0; i < arrObj.length; i++) {
            if (mask[i] === undefined) {
                arrObj[offset] = arrObj[i];
                offset++;
            }
        }
        arrObj.length = offset;
    }

    static deleteById(arrObj: Array<any>, id: number | string): any {
        const foundObj: any = null;
        arrObj.every((obj, idx) => {
            if (obj.id === id) {
                if (idx > -1) {
                    arrObj.splice(idx, 1);
                }
                return false;
            }
            return true;
        });
        return 0;
    }

    static deleteByIdAndReturnNewArray(arrObj: any[], id: number | string): any {
        const filteredArray = arrObj.filter((obj, idx) => {
            if (obj.id === id) {
                return false;
            }

            return true;
        });

        return filteredArray;
    }


    static getObjectIndex(arrObj: Array<any>, query: any): any {
        let foundObjIdx: any = null;
        arrObj.every((obj, idx) => {
            let match = true;
            for (const fieldName in query) {
                if (query.hasOwnProperty(fieldName)) {
                match = match && (obj[fieldName] === query[fieldName]);
                }
            }
            if (match) {
                foundObjIdx = idx;
                return false;
            }
            return true;
        });
        return foundObjIdx;
    }

    static cropToMinimum(item, config) {
        if (!config.primaryFields) { return item; }
        const minItem = Model.serialize(item, config.primaryFields, config.fieldsToGetIds);
        minItem['full'] = false;

        return minItem;
    }


    static getObjectbyIndexes(arrObj: Array<any>, query: Array<number>, listConfig: any= null): any {
        const foundObjs: any[] = [];
        let match = null;
        query.forEach((id) => {
            match = this.getObject(arrObj, { id: id });
            if (match) {
                if (listConfig === null) {
                    foundObjs.push(match);
                } else {
                    foundObjs.push(this.cropToMinimum(match, listConfig));
                }
            }
        });

        return foundObjs;
    }

    static getNestedValue(obj, nestedField, value = null) {
        try {
            if (typeof nestedField === 'string') {
                return this.getNestedValue(obj, nestedField.split('.'), value);
            } else if (nestedField.length === 1 && value !== null) {
                return obj[nestedField[0]] = value;
                 } else if (nestedField.length === 0) {
                return obj;
                 } else {
                return this.getNestedValue(obj[nestedField[0]], nestedField.slice(1), value);
                 }

        } catch (error) {
            return null;
        }

    }


    static updateObject = (arrObj: [any], element: any) => {
        const uptElement = Model.getObject(arrObj, { id: element.id });
        if (uptElement) { Object.assign(uptElement, element); } else { arrObj.push(element); }
    }

    static getObject(arrObj: Array<any>, query: any): any {
        if (!arrObj) { return null; }
        const arrResult = this.filterObjects(arrObj, query, true);
        if (arrResult.length) {
            return arrResult[0];
        } else {
            return null;
        }
    }



    static OrFilterObjects(arrObj: Array<any>, query: Array<any>) {

        const filteredArray = [];
        for (const parameter of query) {
            filteredArray.concat(this.filterObjects(arrObj, parameter));
        }
        return filteredArray;

    }


    static filterObjects(arrObj: Array<any>, query: any, firstMatch= false) {
        if (!arrObj) { return null; }
        let negation: boolean;
        const reverseIndex: Array<number> = [];
        const matchObjects: Array<any> = [];
        if (arrObj.length > 0) {
            for (let index = 0; index < arrObj.length; index++) {
                const obj = arrObj[index];
                let match = true;
                for (let fieldName in query) {
                    if (query.hasOwnProperty(fieldName)) {
                    let aux: boolean;
                    const queryValue = query[fieldName];

                    if (fieldName.charAt(0) === '!') {
                        negation = true;
                        fieldName = fieldName.substr(1);
                    }

                    // Reproduces the Django .objects.get() behaviour
                    let objValue = loadsh.cloneDeep(this.getNestedValue(obj, fieldName));

                    if (fieldName === 'id') {
                        if (objValue && objValue.hasOwnProperty('id')) {
                            objValue = objValue.id;
                        }
                    }

                    if (Array.isArray(objValue)) {
                        aux = (objValue.indexOf(queryValue) > -1);
                    } else {
                        // tslint:disable-next-line:triple-equals
                        if (queryValue === 'not_null') { aux = !!(objValue); } else { aux = (objValue == queryValue); }
                    }

                    if (negation) { aux = !aux; }

                    match = match && aux;
                }}
                if (match) {
                    matchObjects.push(obj);
                    if (firstMatch) {continue; }
                }
            }
        }
        return matchObjects;
    }


    static serialize(originalData: any, fieldNames: string[], modelNames: string[]) {
        const output = {};
        const data = loadsh.cloneDeep(originalData);
        for (const fieldName of fieldNames) {
            if (typeof (data[fieldName]) === 'undefined') {
                continue;
            }
            output[fieldName] = data[fieldName];
        }

        for (const modelName of modelNames) {
            if (typeof (data[modelName]) === 'undefined') {
                continue;
            }
            if (Array.isArray(data[modelName])) {
                output[modelName] = data[modelName]
                    .map(value => {
                        if (value === null) { return null; }
                        if (value.hasOwnProperty('id')) { return value.id; }
                        if (typeof (value) === 'number' || typeof (value) === 'string') { return value; }
                    });
            } else {
                const value = data[modelName];
                if (value === null) { output[modelName] = null; }
                else if (value.hasOwnProperty('id')) { output[modelName] = value.id; }
                else if (typeof (value) === 'number' || typeof (value) === 'string') { output[modelName] = value; }
            }
        }

        return output;
    }

    static searchObjects(arrObj: Array<any>, queryProperties: string[], query: string) {
        const negation: boolean = true;
        // let reverseIndex: Array<number> = [];
        const matchObjects: Array<any> = [];
        if (arrObj.length > 0) {
            for (let index = 0; index < arrObj.length; index++) {
                const obj = arrObj[index];
                let match = true;

                if (queryProperties.length > 0) {
                    {
                        for (const fieldIdx in queryProperties) {
                            if (queryProperties.hasOwnProperty(fieldIdx)) {
                            let aux: boolean;

                            const fieldName = queryProperties[fieldIdx];
                            // if (fieldName.includes(searchvalue)){

                            // }
                            // if (fieldName.charAt(0)=='!'){
                            //   negation = true;
                            //   fieldName=fieldName.substr(1);
                            // }

                            // Reproduces the Django .objects.get() behaviour
                            const objValue = loadsh.cloneDeep(this.getNestedValue(obj, fieldName));

                            // if (fieldName == 'id') {
                            //   if (objValue && objValue.hasOwnProperty('id'))
                            //     objValue = objValue.id;
                            // }

                            // if (Array.isArray(objValue)) {
                            //   aux = (objValue.indexOf(query) > -1);
                            // } else {
                            //   // if (queryValue == 'not_null') aux = !!(objValue);
                            //   // else

                            // }
                            aux = objValue.toLowerCase().includes(query);

                            if (negation) { aux = !aux; }

                            match = match && aux;
                        }}
                    }


                    if (match) {
                        matchObjects.push(obj);
                    }
                }
            }
            return matchObjects;
        }
    }

    static dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        const byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to an ArrayBuffer
        const ab = new ArrayBuffer(byteString.length);

        // create a view into the buffer
        const ia = new Uint8Array(ab);

        // set the bytes of the buffer to the correct values
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        // write the ArrayBuffer to a blob, and you're done
        const blob = new Blob([ab], {type: mimeString});
        return blob;

      }



    static deleteObjects(arrObj: Array<any>, query: any) {
        const reverseIndex: Array<number> = [];
        const removedIndex: Array<number> = [];

        if (arrObj.length > 0) {

            for (let i = arrObj.length; i > 0; i--) { reverseIndex.push(i - 1); }

            for (const index of reverseIndex) {
                const obj = arrObj[index];
                let match = true;

                for (const fieldName in query) {
                    if (Array.isArray(query[fieldName])) {
                        match = match && (query[fieldName].indexOf(obj[fieldName]) > -1);
                    } else {
                        match = match && (obj[fieldName] === query[fieldName]);
                    }
                }

                if (match) {
                    arrObj.splice(index, 1);
                    removedIndex.push(index);
                }

            }
        }
        return removedIndex;
    }

}










