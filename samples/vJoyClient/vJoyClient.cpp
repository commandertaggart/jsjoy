//////////////////////////////////////////////////////////////////////
// This console application demonstrates how to wrive a vJoy client
//
#include "stdafx.h"
#include "vjoyclient.h"
#include <malloc.h>

int
__cdecl
_tmain(__in int argc, __in PZPWSTR argv)
{

	HDEVINFO hDeviceInfo;
	TCHAR ErrMsg[1000];
	ULONG  bytes;
	HANDLE hDevice;
	USHORT X, Y, Z, ZR;
	JOYSTICK_POSITION	iReport;
	PVOID pPositionMessage;
	UINT	IoCode = LOAD_POSITIONS;
	UINT	IoSize = sizeof(JOYSTICK_POSITION);
	HID_DEVICE_ATTRIBUTES attrib;


	// ---------------------------------------------------------------------------------------------------------- \\
	// Tests if vJoy device is installed 
	// This call to the system requests installation information for the device by its ID (GUID_DEVINTERFACE_VJOY)
	// It does not tests its functionality and it does not care if it is disabled.
	// Returns a valid handle if a driver identified by GUID_DEVINTERFACE_VJOY is installed (Enabeled or Disabled)
	hDeviceInfo = SetupDiGetClassDevs(&GUID_DEVINTERFACE_VJOY, NULL, NULL, DIGCF_PRESENT | DIGCF_INTERFACEDEVICE);
	if (hDeviceInfo == INVALID_HANDLE_VALUE)
	{
		GetErrorString(ErrMsg,1000);
		_tprintf(_T("[E] SetupDiGetClassDevs failed with error: %s\n"), ErrMsg);
		return -1;
	};
	// ---------------------------------------------------------------------------------------------------------- \\


	// ---------------------------------------------------------------------------------------------------------- \\
	// Opens vJoy device for writing
	// Returns a valid handle to the device if the device is responsive
	// Returns an INvalid handle if the device is not responding for some reason
	hDevice = OpenJoystickDevice();
	if (hDevice  == INVALID_HANDLE_VALUE)
		return -1;
	// ---------------------------------------------------------------------------------------------------------- \\


	// ---------------------------------------------------------------------------------------------------------- \\
	// Get the driver attributes (Vendor ID, Product ID, Version Number)
	attrib.Size = sizeof (HID_DEVICE_ATTRIBUTES);	// Prepare the buffer that gets the data
	IoCode = IOCTL_VJOY_GET_ATTRIB;					// The op-code for this request

	// Now - access the device (vJoy) with the right op-code and get the data into the buffer (attrib)
	BOOL res = DeviceIoControl(hDevice, IoCode, NULL, 0, &(attrib), sizeof (HID_DEVICE_ATTRIBUTES), &bytes, NULL);
	if (!res)
	{
		GetErrorString(ErrMsg,1000);
		_tprintf(_T("[E] IOCTL_VJOY_GET_ATTRIB failed with error: %s\n"), ErrMsg);
	}
	else
		_tprintf(_T("[I] VendorID:0x%04X ProductID:0x%04X VersionNumber:%d\n"), attrib.VendorID,  attrib.ProductID, attrib.VersionNumber);
	// Expected result: "VendorID:0x1234 ProductID:0xBEAD VersionNumber:2"
	// ---------------------------------------------------------------------------------------------------------- \\

	// Initialize axes X,Y,Z,Z-Rotation
	X = 20;
	Y = 30;
	Z = 40;
	ZR = 80;

	
	// Loop forever feeding vJoy with changing axes & button values
	// Only 4 axes are dealt with: X,Y,Z,Z-Rotation - you can use all those in JOYSTICK_POSITION
	// However, at this point, vJoy will ignore all but X,Y,Z,X-Rotation,Y-Rotation,Z-Rotation, Dial, Slider
	// In addition the 8 lower bits of field lButtons of JOYSTICK_POSITION represent 8 joystick buttons
	while (1)
	{
		Sleep(20);

		// Update axes X,Y,Z,Z-Rotation
		X+=150;
		Y+=250;
		Z+=350;
		ZR-=200;

		// Set axes X,Y,Z,Z-Rotation to current values
		iReport.wAxisX=X;
		iReport.wAxisY=Y;
		iReport.wAxisZ=Z;
		iReport.wAxisZRot=ZR;

		// Set buttons according to X value
		if (X>0		&& X<2000)		iReport.lButtons = 0x1;
		if (X>2000	&& X<4000)		iReport.lButtons = 0x2;
		if (X>4000	&& X<8000)		iReport.lButtons = 0x4;
		if (X>8000	&& X<12000)		iReport.lButtons = 0x8;
		if (X>12000 && X<16000)		iReport.lButtons = 0x10;
		if (X>16000 && X<20000)		iReport.lButtons = 0x20;
		if (X>20000 && X<24000)		iReport.lButtons = 0x40;
		if (X>24000 && X<32000)		iReport.lButtons = 0X80;

		// Buffer hoding the joystick position (iReport) is ready
		// Cast it to PVOID and print some of it
		pPositionMessage = (PVOID)(&iReport);
		_tprintf(_T("Input: X=%4x, Y=%4x, Buttons=%X; \n"), iReport.wAxisX, iReport.wAxisY, iReport.lButtons);

		// Prepare op-code and buffer size for access to vJoy device
		IoCode = LOAD_POSITIONS;
		IoSize = sizeof(JOYSTICK_POSITION);

		// Send joystick position structure to vJoy device
		if (!DeviceIoControl (hDevice, IoCode, pPositionMessage, IoSize, NULL, 0, &bytes, NULL)) 
		{
			_tprintf(_T("Ioctl to vJoy device failed\n"));
			break;
		}
	};


	// Loop interupted - close handle and exit
	CloseHandle(hDevice);
	_tprintf(_T("OK\n"));

	return 0;
}

/*
Open vJoy device
The handle this function returns will be used as the means to communicate with the device
Return handle to open device or INVALID_HANDLE_VALUE 
*/
HANDLE OpenJoystickDevice(void)
{
	HANDLE hDevice;
	TCHAR ErrMsg[1000];


	// At the moment vJoy is opened as DOS_FILE_NAME ("\\.\PPJoyIOCTL1") - ASCII only!
	_tprintf(_T("CreateFile:  %s\n"), DOS_FILE_NAME);
	hDevice = CreateFileA(DOS_FILE_NAME, GENERIC_WRITE | GENERIC_READ, FILE_SHARE_WRITE | FILE_SHARE_READ, NULL, OPEN_EXISTING, 0, NULL);
	if (hDevice == INVALID_HANDLE_VALUE)
	{
		DWORD err = GetErrorString(ErrMsg,1000);
		_tprintf(_T("[E=0x%x] CreateFile failed for %s with error: %s\n"), err, DOS_FILE_NAME, ErrMsg);
		return INVALID_HANDLE_VALUE;
	};
	return hDevice;
}



/* Helper Functions */
DWORD GetErrorString(TCHAR * Msg, int Size)
{
	TCHAR * s;
	DWORD errorcode = GetLastError();
	int nTChars = FormatMessageA(FORMAT_MESSAGE_ALLOCATE_BUFFER | FORMAT_MESSAGE_FROM_SYSTEM,  NULL, errorcode, 0, (LPSTR)&s,  0, NULL);
	if (!nTChars)
		return errorcode;

	_tcsncpy_s(Msg, Size, s, Size);
	LocalFree(s);
	return errorcode;
}